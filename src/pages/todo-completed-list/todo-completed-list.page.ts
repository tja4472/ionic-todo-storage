import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { CompletedTodoService } from '../../services/completed-todo.service';
import { CurrentTodoService } from '../../services/current-todo.service';

import { TodoCompleted } from '../../shared/models/todo-completed.model';
import { TodoCompletedDetailModal, IModalResult } from '../../modals/todo-completed-detail/todo-completed-detail.modal';

@Component({
  selector: 'tja-page-todo-completed-list',
  templateUrl: 'todo-completed-list.page.html'
})
export class TodoCompletedListPage {
  data$: Observable<TodoCompleted[]>;

  private readonly CLASS_NAME = 'CompletedTodosPage';

  constructor(
    private completedTodoService: CompletedTodoService,
    private currentTodoService: CurrentTodoService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.data$ = completedTodoService.data$;
  }

  ionViewDidLoad() {
    // this.todoCompletedService.initialise();
  }

  editItem(item: TodoCompleted) {
    console.log('editItem:item>', item);

    const modal = this.modalCtrl.create(TodoCompletedDetailModal, { todo: item });

    modal.onDidDismiss((modalResult: IModalResult) => {
      console.log('editItem:onDidDismiss>: modalResult', modalResult);

      if (modalResult.isCancelled) {
        return;
      }

      if (modalResult.todo === undefined) {
        return;
      }

      if (modalResult.isRemoved) {
        this.completedTodoService.removeItem(modalResult.todo);
        return;
      }

      if (modalResult.todo.isComplete) {
        this.completedTodoService.saveItem(modalResult.todo);
      } else {
        this.currentTodoService.moveToCurrent(modalResult.todo);
      }
    });

    modal.present();
  }

  toggleCompleteItem(
    item: TodoCompleted,
  ) {
    console.log('toggleCompleteItem:item>', item);

    if (item.isComplete) {
      this.currentTodoService.moveToCurrent(item);
    }
  }

  ionViewDidLeave() {
    console.log('CompletedTodosPage:ionViewDidLeave');
  }
}
