import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as firebase from 'firebase/app';

import { IDmCompletedTodo } from '../database-models/dm-completed-todo';

import { TodoCompleted } from '../shared/models/todo-completed.model';
import { CompletedTodoService } from './completed-todo.service';

import { AuthService } from '../services/auth.service';
import { DmCompletedTodoService } from '../services/dm-completed-todo.service';

// Multiple subscriptions on a FirebaseListObservable #574
// https://github.com/angular/angularfire2/issues/574
// beta.7

// https://coryrylan.com/blog/angular-2-observable-data-services

// https://dzone.com/articles/how-to-build-angular-2-apps-using-observable-data-1

@Injectable()
export class CompletedTodoServiceLive implements CompletedTodoService {
    private readonly CLASS_NAME = 'CompletedTodoService';
    private readonly DB_LIST_KEY = 'completedTodos';
    private readonly DB_USERS_KEY = '/users';

    private data: TodoCompleted[];
    private dataBehaviorSubject: BehaviorSubject<TodoCompleted[]>;

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
        private dmCompletedTodoService: DmCompletedTodoService,
        // private ngZone: NgZone,
    ) {
        console.log(`%s:constructor()`, this.CLASS_NAME);
        this.data = [];
        this.dataBehaviorSubject = new BehaviorSubject([]) as BehaviorSubject<TodoCompleted[]>;
    }

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
                const arr: TodoCompleted[] = [];

                if (snapshot === null) {
                    return;
                }

                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key === null) {
                        return false;
                    }

                    arr.push(
                        this.dmCompletedTodoService.fromDatabase
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

    removeItem(
        item: TodoCompleted,
    ) {
        console.log('%s:removeItem>', this.CLASS_NAME, item);

        if (this.authService.signedInUserId === null) {
            return;
        }

        if (item.$key === undefined) {
            return;
        }

        firebase.database()
            .ref(this.DB_USERS_KEY)
            .child(this.authService.signedInUserId)
            .child(this.DB_LIST_KEY)
            .child(item.$key)
            .remove();
    }

    saveItem(
        item: TodoCompleted
    ) {
        console.log(`%s:saveItem>`, this.CLASS_NAME, item);
        if (this.authService.signedInUserId === null) {
            return;
        }

        if (item.isNew()) {
            // insert.
            firebase.database()
                .ref(this.DB_USERS_KEY)
                .child(this.authService.signedInUserId)
                .child(this.DB_LIST_KEY)
                .push(toFirebaseTodo(item));
        } else {
            // update.
            if (item.$key === undefined) {
                return;
            }

            firebase.database()
                .ref(this.DB_USERS_KEY)
                .child(this.authService.signedInUserId)
                .child(this.DB_LIST_KEY)
                .child(item.$key)
                .set(toFirebaseTodo(item));
        }
    }
}

function toFirebaseTodo(todo: TodoCompleted): IDmCompletedTodo {
    //
    const result: IDmCompletedTodo = {
        // id: todo.id,
        // id: undefined,
        description: todo.description,
        isComplete: todo.isComplete,
        name: todo.name,
        // userId: todo.userId,
    };

    console.log('toFirebaseTodo>', result);
    return result;
}
/*
function fromDatabase(x: any[]): TodoCompleted[] {
    console.log('fromFirebaseTodo');

    let result = x.map(d => fromFirebaseTodo(d));

    return result;
}
*/
/*
function fromFirebaseTodo(
    id: string,
    x: any
): TodoCompleted {
    console.log('fromFirebaseTodo');

    let result: TodoCompleted = {
        id: id,
        description: x.description,
        isComplete: x.isComplete,
        name: x.name,
        userId: x.userId,
    };

    if (result.description === undefined) {
        result.description = null;
    }

    if (result.isComplete === undefined) {
        result.isComplete = false;
    }

    return result;
}
*/

