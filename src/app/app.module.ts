import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home.page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { TodoCompletedListPage } from '../pages/todo-completed-list/todo-completed-list.page';
import { TodoListPage } from '../pages/todo-list/todo-list.page';

import { TodoListPopover } from '../components/todo-list-popover/todo-list.popover';

import { TodoCompletedDetailModal } from '../modals/todo-completed-detail/todo-completed-detail.modal';
import { TodoDetailModal } from '../modals/todo-detail/todo-detail.modal';

// shared
import { ControlMessagesComponent } from '../shared/components/control-messages/control-messages.component';
import { CreateUserComponent } from '../shared/components/create-user/create-user.component';
import { SignInComponent } from '../shared/components/sign-in/sign-in.component';
// tslint:disable-next-line:max-line-length
import { TodoCompletedDetailComponent } from '../shared/components/todo-completed-detail/todo-completed-detail.component';
import { TodoCompletedListComponent } from '../shared/components/todo-completed-list/todo-completed-list.component';
import { TodoDetailComponent } from '../shared/components/todo-detail/todo-detail.component';
import { TodoListComponent } from '../shared/components/todo-list/todo-list.component';
import { ValidationService } from '../shared/services/validation.service';

import { CompletedTodoService } from '../services/completed-todo.service';
import { CurrentTodoService } from '../services/current-todo.service';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

@NgModule({
  declarations: [
    CreateUserComponent,
    HomePage,
    MyApp,
    Page1,
    Page2,
    SignInComponent,
    TodoCompletedDetailModal,
    TodoCompletedDetailComponent,
    TodoCompletedListComponent,
    TodoCompletedListPage,
    ControlMessagesComponent,
    TodoDetailModal,
    TodoDetailComponent,
    TodoListComponent,
    TodoListPage,
    TodoListPopover,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  // tslint:disable-next-line:object-literal-sort-keys
  bootstrap: [IonicApp],
  entryComponents: [
    TodoCompletedDetailModal,
    TodoCompletedListPage,
    TodoDetailModal,
    TodoListPage,
    HomePage,
    MyApp,
    Page1,
    Page2,
    TodoListPopover,
  ],
  providers: [
    CompletedTodoService,
    CurrentTodoService,
    ValidationService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
