import { Observable } from 'rxjs/Observable';

import { TodoCompleted } from '../shared/models/todo-completed.model';

import { IReorderArrayIndexes } from '../shared/models/reorder-array-indexes.model';
import { Todo } from '../shared/models/todo.model';

export abstract class CurrentTodoService {
    readonly data$: Observable<Todo[]>;

    abstract clearCompletedItems(): void;
    abstract moveToCurrent(
        item: TodoCompleted,
    ): void;
    abstract removeItem(
        item: Todo,
    ): void;
    abstract reorderItems(
        indexes: IReorderArrayIndexes,
    ): void;
    abstract saveItem(
        item: Todo
    ): void;
    abstract startListening(): void;
    abstract stopListening(): void;
    abstract toggleCompleteItem(
        todo: Todo
    ): void;
}
