import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as FirebaseKey from 'firebase-key';

import { TodoCompleted } from '../shared/models/todo-completed.model';

// https://coryrylan.com/blog/angular-observable-data-services

@Injectable()
export class CompletedTodoService {
    private readonly CLASS_NAME = 'CompletedTodoService';
    private readonly IDS_KEY = 'completed-todo-ids';

    private data: TodoCompleted[];
    private dataBehaviorSubject: BehaviorSubject<TodoCompleted[]>;
    private ids: string[];

    get data$() {
        return this.dataBehaviorSubject.asObservable();
    }

    constructor(
        private storage: Storage,
    ) {
        console.log(`%s:constructor()`, this.CLASS_NAME);
        this.data = [];
        this.ids = [];
        this.init();
        this.dataBehaviorSubject = new BehaviorSubject([]) as BehaviorSubject<TodoCompleted[]>;
    }

    public removeItem(
        item: TodoCompleted,
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
        item: TodoCompleted,
    ) {
        console.log('%s:saveItem>', this.CLASS_NAME, item);
        if (item.isNew()) {
            this.addItem(item);
        } else {
            this.editItem(item);
        }

        this.dataBehaviorSubject.next(Object.assign([], this.data));
    }

    private addItem(
        item: TodoCompleted,
    ): void {
        const firebaseKey = FirebaseKey.key();
        const itemToSave = new TodoCompleted(item);
        itemToSave.$key = firebaseKey;
        this.data.unshift(itemToSave);
        this.ids.unshift(firebaseKey);
        this.storage.set(firebaseKey, itemToSave);
        this.storage.set(this.IDS_KEY, this.ids);
    }

    private editItem(
        item: TodoCompleted,
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
                    const todo = new TodoCompleted(dataItem);
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
