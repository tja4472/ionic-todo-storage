import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CurrentTodoService } from './current-todo.service';

import { IReorderArrayIndexes } from '../shared/models/reorder-array-indexes.model';
import { Todo } from '../shared/models/todo.model';
import { TodoCompleted } from '../shared/models/todo-completed.model';

@Injectable()
export class CurrentTodoServiceMock implements CurrentTodoService {
    private readonly CLASS_NAME = 'CurrentTodoServiceMock';

    private data: Todo[];
    private dataBehaviorSubject: BehaviorSubject<Todo[]>;

    get data$() {
        return this.dataBehaviorSubject.asObservable();
    }

    constructor() {
        console.log(`%s:constructor()`, this.CLASS_NAME);
        this.data = this.dummyData();
        this.dataBehaviorSubject = new BehaviorSubject(this.data) as BehaviorSubject<Todo[]>;
    }

    clearCompletedItems(): void {
        console.log(`%s:clearCompletedItems>`, this.CLASS_NAME);
    }

    moveToCurrent(
        item: TodoCompleted,
    ): void {
        console.log(`%s:moveToCurrent>`, this.CLASS_NAME, item);
    }

    removeItem(
        item: Todo,
    ): void {
        console.log(`%s:removeItem>`, this.CLASS_NAME, item);
    }

    reorderItems(
        indexes: IReorderArrayIndexes,
    ): void {
        console.log(`%s:reorderItems>`, this.CLASS_NAME, indexes);
    }

    saveItem(
        item: Todo
    ): void {
        console.log(`%s:saveItem>`, this.CLASS_NAME, item);
    }

    startListening(): void {
        console.log(`%s:startListening>`, this.CLASS_NAME);
    }

    stopListening(): void {
        console.log(`%s:stopListening>`, this.CLASS_NAME);
    }

    toggleCompleteItem(
        item: Todo
    ): void {
        console.log(`%s:toggleCompleteItem>`, this.CLASS_NAME, item);
    }

    private dummyData(): Todo[] {
        const data: Todo[] =
            [
                Object.assign(new Todo(),
                {
                $key: 'AA',
                description: 'AA-description',
                index: 0,
                isComplete: false,
                name: 'AA-name',
                userId: 'a01',
            }),
            Object.assign(new Todo(),
            {
                $key: 'BB',
                description: 'BB-description',
                index: 0,
                isComplete: false,
                name: 'BB-name',
                userId: 'a01',
            }),
            Object.assign(new Todo(),
            {
                $key: 'CC',
                description: 'CC-description',
                index: 0,
                isComplete: true,
                name: 'CC-name',
                userId: 'a01',
            }),
        ];

        return data;
    }
}
