import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { IUserFormResult } from '../../shared/components/create-user/create-user.component';

@Component({
  selector: 'tja-page-register',
  templateUrl: 'register.page.html'
})
export class RegisterPage {
  // Used in view
  public error$: any;

  private readonly CLASS_NAME = 'RegisterPage';

  constructor(
    private authService: AuthService,
  ) {
    console.log('%s:constructor', this.CLASS_NAME);
    this.error$ = authService.error$;
  }

  // Used in view
  public createUser(x: IUserFormResult) {
    console.log('###%s:createUser', this.CLASS_NAME);
    console.log('%s:x>', this.CLASS_NAME, x);
    this.authService.createUserWithEmailAndPassword(x.email, x.password);
  }

  public ionViewDidLeave() {
    console.log('###%s:ionViewDidLeave', this.CLASS_NAME);
    this.authService.clearError$();
  }
}
