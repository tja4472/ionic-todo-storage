import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Todo } from '../../shared/models/todo.model';

@Component({
    selector: 'tja-modal-todo-detail',
    templateUrl: 'todo-detail.modal.html',
})
export class TodoDetailModal {
    public viewTodo: Todo;

    private readonly CLASS_NAME = 'TodoDetailModal';

    constructor(
        navParams: NavParams,
        public viewController: ViewController
    ) {
        console.log(`%s:constructor`, this.CLASS_NAME);
        // navParams passes by reference.
        const navParamsTodo: Readonly<Todo> = Object.assign(new Todo(), navParams.get('todo'));
        console.log('navParamsTodo>', navParamsTodo);
        console.log('navParamsTodo.isNew()>', navParamsTodo.isNew());

        this.viewTodo = Object.assign(new Todo(), navParamsTodo);
        console.log('this.viewTodo>', this.viewTodo);

/*
        const paramTodo: Todo = navParams.get('todo');

        if (paramTodo) {
            this.viewTodo = paramTodo;
        } else {
            this.viewTodo = new Todo();
        }
*/
    }

    viewItemCancelled() {
        console.log('viewItemCancelled>');
        this.viewController.dismiss();
    }

    viewItemSaved(item: Todo) {
        console.log('viewItemSaved>', item);
        this.viewController.dismiss(item);
    }
}
