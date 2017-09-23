import { Component, OnInit, ViewChild } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';

import { SignedInUser } from '../models/signed-in-user.model';

import { HomePage } from '../pages/home/home.page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { RegisterPage } from '../pages/register/register.page';
import { SignInPage } from '../pages/sign-in/sign-in.page';
import { TodoCompletedListPage } from '../pages/todo-completed-list/todo-completed-list.page';
import { TodoListPage } from '../pages/todo-list/todo-list.page';

import { AuthService } from '../services/auth.service';
import { CompletedTodoService } from '../services/completed-todo.service';
import { CurrentTodoService } from '../services/current-todo.service';

export interface IPageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  public displayUserName: string;
  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: IPageInterface[] = [
    { title: 'Home Page', component: HomePage, icon: 'calendar' },
    { title: 'Page One', component: Page1, icon: 'calendar' },
    { title: 'Page Two', component: Page2, icon: 'calendar' },
  ];

  loggedInPages: IPageInterface[] = [
    { title: 'Current Todos Page', component: TodoListPage, icon: 'calendar' },
    { title: 'Completed Todos Page', component: TodoCompletedListPage, icon: 'calendar' },
    { title: 'Sign Out', component: Page1, icon: 'log-out', logsOut: true }
  ];

  loggedOutPages: IPageInterface[] = [
    { title: 'Sign In', component: SignInPage, icon: 'log-in' },
    { title: 'Register', component: RegisterPage, icon: 'person-add' },
  ];

  rootPage: any; // = Page1;

  pages: Array<{ title: string, component: any }>;


  private readonly CLASS_NAME = 'MyApp';

  constructor(
    public events: Events,
    public menu: MenuController,
    // private ngZone: NgZone,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private authService: AuthService,
    private completedTodoService: CompletedTodoService,
    private currentTodoService: CurrentTodoService,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.initializeApp();
  }

  ngOnInit() {
    console.log(`%s:ngOnInit`, this.CLASS_NAME);
    // check login state.
    //  firebase.auth().onAuthStateChanged((_currentUser) => {
    // this.authService.init();
  }

  initializeApp() {
    console.log(`%s:initializeApp`, this.CLASS_NAME);
    const bootTime = Date.now();

    this.platform.ready().then((readySource) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log(`%s:platform.ready()`, this.CLASS_NAME);
      console.log(`%s:readySource>`, this.CLASS_NAME, readySource);

      const readyTime = Date.now();
      this.events.subscribe('app:boot', (time: number) => {
        console.log('App boot start: ', bootTime);
        console.log('App boot ready: ', readyTime);
        console.log('App boot done: ', time);
        console.log('Diff boot', time - bootTime);
        console.log('Diff ready', time - readyTime);
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      /*
            this.authService.replaySubject$.subscribe((user:CurrentUser) => {
      console.log('>>>>>>>>>>>>>>app.component.ts: authService.replaySubject$>', user);
            });
      */
      // This has to be done after platform.ready() else enableMenu() will
      // not change menu.
      this.setupAuthServiceSubscription();
    });
  }

  openPage(page: IPageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    // this.rootPage = page.component;
    // console.log('NgZone.isInAngularZone()-2>', NgZone.isInAngularZone());
    this.nav.setRoot(page.component).catch(() => {
      console.error('openPage:Didn\'t set nav root.');
    });

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.authService.doLogout();
      }, 1000);
    }
  }

  enableMenu(loggedIn: boolean): void {
    const loggedInMenu = 'loggedInMenu';
    const loggedOutMenu = 'loggedOutMenu';

    if (!this.menu.get(loggedInMenu)) {
      console.error(`%s:enableMenu() *** WARNING: Menu not found>`, this.CLASS_NAME, loggedInMenu);
    }

    if (!this.menu.get(loggedOutMenu)) {
      console.error(`%s:enableMenu() *** WARNING: Menu not found>`, this.CLASS_NAME, loggedOutMenu);
    }

    this.menu.enable(loggedIn, loggedInMenu);
    this.menu.enable(!loggedIn, loggedOutMenu);
  }

  isActive(page: IPageInterface) {
    const childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }

  private setupAuthServiceSubscription() {
    this.authService.notifier$.subscribe((signedInUser: SignedInUser) => {
      console.log('>>>>>>>>>>signedInUser>', signedInUser);
      if (signedInUser) {
        console.log(`%s: -- logged in --`, this.CLASS_NAME);
        this.displayUserName = signedInUser.displayName;

        this.enableMenu(true);
        this.nav.setRoot(TodoListPage).catch(() => {
          console.error('Didn\'t set nav root');
        });

        this.currentTodoService.startListening();
        this.completedTodoService.startListening();
      } else {
        console.log(`%s: -- logged out --`, this.CLASS_NAME);
        this.displayUserName = 'Not signed in';
        this.enableMenu(false);
        this.nav.setRoot(HomePage).catch(() => {
          console.error('Didn\'t set nav root');
        });
        console.log(`%s: -- logged out 1--`, this.CLASS_NAME);
        this.currentTodoService.stopListening();
        console.log(`%s: -- logged out 2--`, this.CLASS_NAME);
        this.completedTodoService.stopListening();
        console.log(`%s: -- logged out 3 --`, this.CLASS_NAME);
      }
    });
    // });
  }
}
