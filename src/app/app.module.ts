import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler,  IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home.page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { RegisterPage } from '../pages/register/register.page';
import { SignInPage } from '../pages/sign-in/sign-in.page';
import { TodoCompletedListPage } from '../pages/todo-completed-list/todo-completed-list.page';
import { TodoListPage } from '../pages/todo-list/todo-list.page';

import { AuthService } from '../services/auth.service';

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

import { CompletedTodoServiceLive } from '../services/completed-todo-live.service';
import { CompletedTodoService } from '../services/completed-todo.service';
// import { CompletedTodoServiceMock } from '../services/completed-todo-mock.service';

import { CurrentTodoServiceLive } from '../services/current-todo-live.service';
import { CurrentTodoService } from '../services/current-todo.service';
// import { CurrentTodoServiceMock } from '../services/current-todo-mock.service';

import { DmCompletedTodoService } from '../services/dm-completed-todo.service';



import { MY_FIREBASE_APP_CONFIG } from './my-firebase-app-config';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

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
    SignInPage,
    TodoListPopover,
    RegisterPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
    SignInPage,
    TodoListPopover,
    RegisterPage,
  ],
  providers: [
    AuthService,
    { provide: CompletedTodoService, useClass: CompletedTodoServiceLive },
    { provide: CurrentTodoService, useClass: CurrentTodoServiceLive },
    DmCompletedTodoService,
    ValidationService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {

  constructor() {
    firebase.initializeApp(MY_FIREBASE_APP_CONFIG);
  }
}
