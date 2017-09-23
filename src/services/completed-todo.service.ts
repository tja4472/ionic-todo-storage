import { Observable } from 'rxjs/Observable';

import { TodoCompleted } from '../shared/models/todo-completed.model';

export abstract class CompletedTodoService {
    readonly data$: Observable<TodoCompleted[]>;

    abstract removeItem(
        item: TodoCompleted,
    ): void;
    abstract saveItem(
        item: TodoCompleted
    ): void;

    abstract startListening(): void;
    abstract stopListening(): void;
}
