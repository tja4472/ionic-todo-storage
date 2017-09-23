import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { RegisterPage } from '../register/register.page';

import { AuthService } from '../../services/auth.service';

import { ISignInComponentResult } from '../../shared/components/sign-in/sign-in.component';

@Component({
  selector: 'tja-page-sign-in',
  templateUrl: 'sign-in.page.html'
})
export class SignInPage {
  // Used in view
  public error$: any;

  private readonly CLASS_NAME = 'SignInPage';

  constructor(
    private authService: AuthService,
    private nav: NavController,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.error$ = authService.error$;
  }

  public ionViewDidLeave() {
    console.log('###%s:ionViewDidLeave', this.CLASS_NAME);
    this.authService.clearError$();
  }

  public viewRegister(): void {
    console.log('viewRegister>');
    // Should be root.
    this.nav.push(RegisterPage);
  }

  public viewSignIn(x: ISignInComponentResult): void {
    console.log('viewSignIn>', x);
    this.authService.doLogin(x.email, x.password);
  }
}
