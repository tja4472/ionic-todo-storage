import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html'
})
export class HomePage {
  private readonly CLASS_NAME = 'HomePage';

  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
  }

  doLogout() {
    this.authService.doLogout();
  }
}
