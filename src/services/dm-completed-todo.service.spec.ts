import { DmCompletedTodoService } from './dm-completed-todo.service';
import { IDmCompletedTodo } from '../database-models/dm-completed-todo';
import { TodoCompleted } from '../shared/models/todo-completed.model';

const data: IDmCompletedTodo = {
    description: 'description',
    isComplete: false,
    name: 'name',
};

const expected = new TodoCompleted({
    $key: 'id1',
    description: 'description',
    isComplete: true,
    name: 'name',
    userId: 'uu',
});

describe('DM_CompletedTodoService', () => {
    it('fromDatabase', () => {
        const dmCompletedTodoService = new DmCompletedTodoService();
        const result = dmCompletedTodoService.fromDatabase('id1', data);
        expect(result).toEqual(expected);
    });
});
