import { Component, OnInit, ViewChild } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';

import { HomePage } from '../pages/home/home.page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { TodoCompletedListPage } from '../pages/todo-completed-list/todo-completed-list.page';
import { TodoListPage } from '../pages/todo-list/todo-list.page';

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
  ];

  loggedOutPages: IPageInterface[] = [
  ];

  rootPage: any; // = Page1;

  pages: Array<{ title: string, component: any }>;


  private readonly CLASS_NAME = 'MyApp';

  constructor(
    public events: Events,
    public menu: MenuController,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.initializeApp();
  }

  ngOnInit() {
    console.log(`%s:ngOnInit`, this.CLASS_NAME);
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

      this.enableMenu(true);
      this.nav.setRoot(TodoListPage);
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
      /*
      setTimeout(() => {
        this.authService.doLogout();
      }, 1000);
      */
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
}
