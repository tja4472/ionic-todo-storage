import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-page1',
  templateUrl: './page1.html'
})
export class Page1 {

  constructor(
    public navCtrl: NavController,
    // private authService: AuthService,
  ) {

  }

  doLogout() {
    // this.authService.doLogout()
  }
}
