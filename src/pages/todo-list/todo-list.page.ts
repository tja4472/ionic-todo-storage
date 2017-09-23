import { Component } from '@angular/core';

import {
  Events,
  ModalController,
  NavController,
  PopoverController,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { CurrentTodoService } from '../../services/current-todo.service';

import { IReorderArrayIndexes } from '../../shared/models/reorder-array-indexes.model';
import { Todo } from '../../shared/models/todo.model';

import { TodoDetailModal } from '../../modals/todo-detail/todo-detail.modal';
import {
  TodoListPopover,
  ITodoListPopoverResult
} from '../../components/todo-list-popover/todo-list.popover';

@Component({
  selector: 'tja-page-todo-list',
  templateUrl: 'todo-list.page.html'
})
export class TodoListPage {
  todos$: Observable<Todo[]>;

  private readonly CLASS_NAME = 'TodoListPage';

  constructor(
    public events: Events,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private todoService: CurrentTodoService,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.todos$ = this.todoService.data$;
  }

  addItem() {
    console.log('addItem');
    this.showModal();
  }

  toggleCompleteItem(item: Todo) {
    console.log('completeItem:item>', item);
    this.todoService.toggleCompleteItem(item);
  }

  editItem(item: Todo) {
    console.log('editItem:item>', item);
    this.showModal(item);
  }

  presentPopover(event: Event) {
    const popover = this.popoverCtrl.create(TodoListPopover);

    popover.onDidDismiss((result: ITodoListPopoverResult) => {
      console.log('popover.onDidDismiss>', result);

      if (!!!result) {
        // no result.
        console.log('result is null.');
        return;
      }

      console.log('result.clearCompleted>', result.clearCompleted);
      if (result.clearCompleted) {
        this.todoService.clearCompletedItems();
        return;
      }
    });

    popover.present({
      ev: event
    });
  }

  reorderItems(indexes: IReorderArrayIndexes) {
    console.log('reorderItems:indexes>', indexes);
    console.log('reorderItems:indexes.from>', indexes.from);
    console.log('reorderItems:indexes.to>', indexes.to);
    this.todoService.reorderItems(indexes);
    // http://ionicframework.com/docs/v2/api/components/item/ItemReorder/
    // this.items = reorderArray(this.items, indexes);
  }

  removeItem(item: Todo) {
    console.log('CurrentTodosPage:removeItem:item>', item);
    this.todoService.removeItem(item);
  }

  ionViewCanEnter(): boolean {
    console.log('CurrentTodosPage:ionViewCanEnter');
    // Check if logged in.
    return true;
    // return false;
  }

  ionViewDidLeave() {
    console.log('CurrentTodosPage:ionViewDidLeave');
  }

  ionViewDidLoad() {
    console.log('CurrentTodosPage:ionViewDidLoad');
    this.events.publish('app:boot', Date.now());
  }

  private showModal(item?: Todo) {
    //
    const modal = this.modalCtrl.create(TodoDetailModal, { todo: item });

    modal.onDidDismiss((data: Todo) => {
      console.log('onDidDismiss>', data);

      if (!!data) {
        this.todoService.saveItem(data);
      }
    });

    modal.present();
  }
}
