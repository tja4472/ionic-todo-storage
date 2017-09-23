import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as firebase from 'firebase/app';

import { reorderArray } from 'ionic-angular';

import { AuthService } from '../services/auth.service';

import { CompletedTodoService } from '../services/completed-todo.service';
import { CurrentTodoService } from './current-todo.service';

import { IReorderArrayIndexes } from '../shared/models/reorder-array-indexes.model';

import { IDmCurrentTodo } from '../database-models/dm-current-todo';

import { Todo } from '../shared/models/todo.model';
import { TodoCompleted } from '../shared/models/todo-completed.model';



// Multiple subscriptions on a FirebaseListObservable #574
// https://github.com/angular/angularfire2/issues/574
// beta.7

// https://coryrylan.com/blog/angular-2-observable-data-services

// https://dzone.com/articles/how-to-build-angular-2-apps-using-observable-data-1

@Injectable()
export class CurrentTodoServiceLive implements CurrentTodoService {
    private readonly CLASS_NAME = 'CurrentTodoService';
    private readonly DB_LIST_KEY = 'currentTodos';
    private readonly DB_USERS_KEY = '/users';

    private data: Todo[];
    private dataBehaviorSubject: BehaviorSubject<Todo[]>;

    private databaseReferenceListening: firebase.database.Reference;

    get data$() {
        return this.dataBehaviorSubject.asObservable();
    }

    /*
    Currently this is a singleton for the app.
    So constructor gets called once.

    Database needs to be requeried when login status changes.
    */
    constructor(
        private authService: AuthService,
        private completedTodoService: CompletedTodoService,
        // private ngZone: NgZone,
    ) {
        console.log('%s:constructor()', this.CLASS_NAME);
        this.data = [];
        this.dataBehaviorSubject = new BehaviorSubject([]) as BehaviorSubject<Todo[]>;
    }

    public clearCompletedItems(): void {
        console.log('%s:clearCompletedItems', this.CLASS_NAME);
        const completedItems = this.data.filter((a) => a.isComplete);
        console.log('%s:completedItems>', this.CLASS_NAME, completedItems);

        completedItems.map((x) => {
            const todoCompleted: TodoCompleted =
                Object.assign(new TodoCompleted(),
                    {
                        description: x.description,
                        name: x.name,
                    });

            this.completedTodoService.saveItem(todoCompleted);
            this.removeItem(x);
        });
    }

    public moveToCurrent(
        item: TodoCompleted,
    ): void {
        console.log('%s:clearCompletedItems', this.CLASS_NAME, item);
        const todo: Todo = new Todo();
        todo.description = item.description;
        todo.isComplete = false;
        todo.name = item.name;

        this.saveItem(todo);
        this.completedTodoService.removeItem(item);
    }

    /*
        public reset(): void {
            console.log('CurrentTodoService#reset');
            this.data = [];
            this.dataBehaviorSubject = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
        }
    */
    public startListening(
        // userId: string,
    ): void {
        console.log('%s:startListening()', this.CLASS_NAME);
        if (this.authService.signedInUserId === null) {
            return;
        }

        const signedInUserId: string = this.authService.signedInUserId;

        this.databaseReferenceListening = firebase.database()
            .ref(this.DB_USERS_KEY)
            .child(signedInUserId)
            .child(this.DB_LIST_KEY);

        this.databaseReferenceListening
            .orderByChild('index')
            .on('value', (snapshot) => {
                // console.log('snapshot>', snapshot);
                if (snapshot === null) {
                    return;
                }

                const arr: Todo[] = [];

                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key === null) {
                        return false;
                    }

                    arr.push(
                        fromFirebaseTodo
                            (childSnapshot.key,
                            childSnapshot.val(),
                        ));
                    return false;
                });

                console.log('arr>', arr);
                this.data = arr;
                // NgZone.isInAngularZone() = false
                // console.log('isInAngularZone()-2>', NgZone.isInAngularZone());
                // this.ngZone.run(() => {
                // NgZone.isInAngularZone() = true
                // console.log('isInAngularZone()-3>', NgZone.isInAngularZone());
                // this._todos.next(Object.assign({}, this.dataStore).todos);
                this.dataBehaviorSubject.next(Object.assign([], this.data));
                // });
            });
    }

    public stopListening(): void {
        console.log('%s:stopListening()', this.CLASS_NAME);

        if (this.databaseReferenceListening != null) {
            this.databaseReferenceListening.off();
            // this.databaseReferenceListening = null;
        }
    }

    reorderItems(
        indexes: IReorderArrayIndexes,
    ) {
        console.log('%s:reorderItems():indexes>', this.CLASS_NAME, indexes);
        if (this.authService.signedInUserId === null) {
            return;
        }

        const itemsToSave = [...this.data];
        reorderArray(itemsToSave, indexes);

        const updates: any = {};
        for (let x = 0; x < itemsToSave.length; x++) {
            updates[itemsToSave[x].$key + '/index'] = x;
        }

        // this.databaseReference.update(updates);
        firebase.database()
            .ref(this.DB_USERS_KEY)
            .child(this.authService.signedInUserId)
            .child(this.DB_LIST_KEY)
            .update(updates);
    }

    removeItem(
        item: Todo,
    ) {
        console.log('%s:removeItem>', this.CLASS_NAME, item);
        if (this.authService.signedInUserId === null) {
            return;
        }
        if (item.$key === undefined) {
            return;
        }

        // this.databaseReference
        //  .child(item.id)
        //  .remove();
        firebase.database()
            .ref(this.DB_USERS_KEY)
            .child(this.authService.signedInUserId)
            .child(this.DB_LIST_KEY)
            .child(item.$key)
            .remove();
    }

    saveItem(
        item: Todo,
    ) {
        console.log('%s:saveItem>', this.CLASS_NAME, item);
        if (this.authService.signedInUserId === null) {
            return;
        }
        if (item.$key === undefined) {
            // insert.
            // this.databaseReference
            // .push(toFirebaseTodo(item));
            firebase.database()
                .ref(this.DB_USERS_KEY)
                .child(this.authService.signedInUserId)
                .child(this.DB_LIST_KEY)
                .push(toFirebaseTodo(item));
        } else {
            // update.
            // this.databaseReference
            // .child(item.id)
            // .set(toFirebaseTodo(item));
            firebase.database()
                .ref(this.DB_USERS_KEY)
                .child(this.authService.signedInUserId)
                .child(this.DB_LIST_KEY)
                .child(item.$key)
                .set(toFirebaseTodo(item));
        }
    }

    public toggleCompleteItem(
        todo: Todo
    ): void {
        console.log('%s:toggleCompleteItem>', this.CLASS_NAME, todo);
        todo.isComplete = !todo.isComplete;
        this.saveItem(todo);
    }
}


function toFirebaseTodo(todo: Todo): IDmCurrentTodo {
    //
    const result: IDmCurrentTodo = {
        // id: todo.id,
        // id: undefined,
        description: todo.description,
        index: todo.index,
        isComplete: todo.isComplete,
        name: todo.name,
        // userId: todo.userId,
        // userId: 'aaa',
    };

    console.log('toFirebaseTodo>', result);
    return result;
}

// toDataModel
/*
function fromDatabase(x: any[]): Todo[] {
    console.log('fromFirebaseTodo');

    let result = x.map(d => fromFirebaseTodo(d));

    return result;
}
*/

function fromFirebaseTodo(
    id: string,
    x: any,
): Todo {
    console.log('fromFirebaseTodo');

    const result: Todo = new Todo();
    result.$key = id;
    result.description = x.description;
    result.index = x.index;
    result.isComplete = x.isComplete;
    result.name = x.name;

    /*
        if (result.description === undefined) {
            result.description = null;
        }
    */
    if (result.isComplete === undefined) {
        result.isComplete = false;
    }

    return result;
}
