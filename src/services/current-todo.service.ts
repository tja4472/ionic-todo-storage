import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as FirebaseKey from 'firebase-key';

import { reorderArray } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CompletedTodoService } from '../services/completed-todo.service';

import { IReorderArrayIndexes } from '../shared/models/reorder-array-indexes.model';

import { Todo } from '../shared/models/todo.model';
import { TodoCompleted } from '../shared/models/todo-completed.model';

// https://coryrylan.com/blog/angular-observable-data-services

@Injectable()
export class CurrentTodoService {
    private readonly CLASS_NAME = 'CurrentTodoService';

    private readonly IDS_KEY = 'todo-ids';

    private data: Todo[];
    private dataBehaviorSubject: BehaviorSubject<Todo[]>;
    private ids: string[];

    get data$() {
        return this.dataBehaviorSubject.asObservable();
    }

    constructor(
        private completedTodoService: CompletedTodoService,
        private storage: Storage,
    ) {
        console.log('%s:constructor()', this.CLASS_NAME);
        this.data = [];
        this.ids = [];
        this.init();
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

    public reorderItems(
        indexes: IReorderArrayIndexes,
    ) {
        console.log('%s:reorderItems():indexes>', this.CLASS_NAME, indexes);

        const itemsToSave = [...this.data];
        reorderArray(itemsToSave, indexes);

        const idsToSave = [...this.ids];

        console.log('itemsToSave>', itemsToSave);

        itemsToSave.forEach((t, i) => {
            if (!t.$key) {
                return;
            }
            t.index = i;
            idsToSave[i] = t.$key;
            this.storage.set(t.$key, t);
        });

        this.storage.set(this.IDS_KEY, idsToSave);

        this.data = itemsToSave;
        this.dataBehaviorSubject.next(Object.assign([], this.data));
    }

    public removeItem(
        item: Todo,
    ) {
        console.log('%s:removeItem>', this.CLASS_NAME, item);
        if (item.$key === undefined) {
            return;
        }

        this.data = this.data.filter((x) => x.$key !== item.$key);
        this.ids = this.ids.filter((x) => x !== item.$key);

        this.storage.remove(item.$key);
        this.storage.set(this.IDS_KEY, this.ids);

        this.dataBehaviorSubject.next(Object.assign([], this.data));
    }

    public saveItem(
        item: Todo,
    ) {
        console.log('%s:saveItem>', this.CLASS_NAME, item);
        if (item.isNew()) {
            this.addItem(item);
        } else {
            this.editItem(item);
        }

        this.dataBehaviorSubject.next(Object.assign([], this.data));
    }

    public toggleCompleteItem(
        todo: Todo
    ): void {
        console.log('%s:toggleCompleteItem>', this.CLASS_NAME, todo);
        todo.isComplete = !todo.isComplete;
        this.saveItem(todo);
    }

    private addItem(
        item: Todo,
    ): void {
        const firebaseKey = FirebaseKey.key();
        const itemToSave = new Todo(item);
        itemToSave.$key = firebaseKey;
        this.data.unshift(itemToSave);
        this.ids.unshift(firebaseKey);
        this.storage.set(firebaseKey, itemToSave);
        this.storage.set(this.IDS_KEY, this.ids);
    }

    private editItem(
        item: Todo,
    ): void {
        if (!item.$key) {
            return;
        }

        this.data.forEach((t, i) => {
            if (t.$key === item.$key) {
                this.data[i] = item;
                return;
            }
        });

        console.log('this.data>', this.data);
        this.storage.set(item.$key, item);
    }

    private init() {
        this.storage.get(this.IDS_KEY).then((ids: string[]) => {
            console.log('ids>', ids);
            if (!ids) {
                return;

            }
            this.ids = ids;

            let proms: Array<Promise<any>> = [];
            proms = ids.map((id) => this.storage.get(id));
            Promise.all(proms).then((dataArray) => {
                console.log('dataArray>', dataArray);

                const y = dataArray.map((dataItem) => {
                    // console.log('z>', dataItem);
                    const todo = new Todo(dataItem);
                    // console.log('k>', k);
                    return todo;
                });

                console.log('y>', y);
                this.data = y;
                this.dataBehaviorSubject.next(Object.assign([], this.data));
            });
        });
    }
}
