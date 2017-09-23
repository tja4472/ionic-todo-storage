import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TodoCompleted } from '../shared/models/todo-completed.model';
import { CompletedTodoService } from './completed-todo.service';

@Injectable()
export class CompletedTodoServiceMock implements CompletedTodoService {
    private readonly CLASS_NAME = 'CompletedTodoServiceMock';

    private data: TodoCompleted[];
    private dataBehaviorSubject: BehaviorSubject<TodoCompleted[]>;

    get data$() {
        return this.dataBehaviorSubject.asObservable();
    }

    constructor() {
        console.log(`%s:constructor()`, this.CLASS_NAME);
        this.data = this.dummyData();
        this.dataBehaviorSubject = new BehaviorSubject(this.data) as BehaviorSubject<TodoCompleted[]>;
    }

    removeItem(
        item: TodoCompleted,
    ): void {
        console.log(`%s:removeItem>`, this.CLASS_NAME, item);
    }

    saveItem(
        item: TodoCompleted
    ): void {
        console.log(`%s:saveItem>`, this.CLASS_NAME, item);
    }

    startListening(): void {
        console.log(`%s:startListening>`, this.CLASS_NAME);
    }

    stopListening(): void {
        console.log(`%s:stopListening>`, this.CLASS_NAME);
    }

    private dummyData(): TodoCompleted[] {
        const data: TodoCompleted[] =
            [
                Object.assign(new TodoCompleted(),
                {
                description: 'AA-description',
                id: 'AA',
                isComplete: true,
                name: 'AA-name',
                userId: 'a01',
            }),
            Object.assign(new TodoCompleted(),
            {
                description: 'BB-description',
                id: 'BB',
                isComplete: true,
                name: 'BB-name',
                userId: 'a01',
            }),
            Object.assign(new TodoCompleted(),
            {
                description: 'CC-description',
                id: 'CC',
                isComplete: true,
                name: 'CC-name',
                userId: 'a01',
            })];

        return data;
    }
}

