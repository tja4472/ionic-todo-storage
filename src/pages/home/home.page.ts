import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html'
})
export class HomePage {
  private readonly CLASS_NAME = 'HomePage';

  constructor(
    public navCtrl: NavController,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
  }
}
