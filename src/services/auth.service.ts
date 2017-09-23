import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs/Rx';

import { SignedInUser } from '../models/signed-in-user.model';

import * as firebase from 'firebase/app';

// Original: https://github.com/aaronksaunders/Ionic2-Ionic.io-Auth-Example

@Injectable()
export class AuthService {
    public error$ = new ReplaySubject<Error | null>(1);

    public notifier$: ReplaySubject<SignedInUser | null> = new ReplaySubject<SignedInUser>(1);
    private _signedInUser: SignedInUser | null;

    private readonly CLASS_NAME = 'AuthService';

    public get signedInUserId(): string | null {
        if (this._signedInUser) {
            return this._signedInUser.userId;
        } else {
            return null;
        }
    }

    constructor(
    ) {
        console.log(`%s:constructor`, this.CLASS_NAME);
        this.clearError$();

        firebase.auth().onAuthStateChanged((firebaseUser: firebase.User) => {
            if (firebaseUser) {
                // User is signed in.
                console.log(`%s:User is signed in>`, this.CLASS_NAME, firebaseUser.uid);

                this._signedInUser = this.createSignedInUser(firebaseUser);
                this.notifier$.next(this._signedInUser);
            } else {
                // No user is signed in.
                console.log(`%s: No user is signed in.`, this.CLASS_NAME);
                this.notifier$.next(null);
            }
        });
    }

    public clearError$() {
        this.error$.next(null);
    }

    /**
     * here we check to see if ionic saved a user for us
     */
    doCheckAuth() {
        console.log('%s:doCheckAuth()', this.CLASS_NAME);
        /*
                if (this.auth.isAuthenticated()) {
                    let authUser: ActiveUser = {
                        id: this.user.id,
                        email: this.user.details.email,
                        image: this.user.details.image,
                        name: this.user.details.name,
                        userName: this.user.details.username
                    };

                    this.activeUser.next(authUser);
                }
        */
    }

    /**
     * login using a username and password
     */
    doLogin(
        username: string,
        password: string
    ) {
        console.log('%s:doLogin()', this.CLASS_NAME);
        if (username.length) {
            firebase.auth().signInWithEmailAndPassword(username, password)
                .catch((error) => {
                    // Handle Errors here.
                    console.log('error>', error);
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    // ...
                    this.error$.next(error);
                });
        }
    }

    /**
     * create the user with the information and set the user object
     */
    /*
        doCreateUser(_params) {
            console.log('%s:doCreateUser()', this.CLASS_NAME);
            /*
                    this.auth.signup({ email: _params.email, password: _params.password, username: _params.username })
                        .then(() => {
                            return this.doLogin(_params.email, _params.password);
                        }, (err: IDetailedError<string[]>) => {
                            console.log(err)
                            for (let e of err.details) {
                                if (e === 'conflict_email') {
                                    alert('Email already exists.');
                                } else {
                                    // handle other errors
                                }
                            }
                        });
            * /
        }
    */
    public createUserWithEmailAndPassword(
        email: string,
        password: string) {
        console.log('###%s:createUserWithEmailAndPassword', this.CLASS_NAME);
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch((error) => {
                // Handle Errors here.
                /*
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                if (errorCode == 'auth/weak-password') {
                                    alert('The password is too weak.');
                                } else {
                                    alert(errorMessage);
                                }
                */
                console.log('error>', error);
                this.error$.next(error);
            });
    }

    doSignup(
        email: string,
        _password?: string) {
        console.log('%s:doSignup()', this.CLASS_NAME);
        if (email.length) {
            // firebase.auth().createUserWithEmailAndPassword
            /*
             let details = { 'email': _email, 'password': _password };

                         this.auth.signup(details)
                             .then(() => {
                                 return this.doLogin(_email, _password);
                             }, (err: IDetailedError<string[]>) => {
                                 console.log(err)
                                 for (let e of err.details) {
                                     if (e === 'conflict_email') {
                                         alert('Email already exists.');
                                     } else {
                                         // handle other errors
                                     }
                                 }
                             });
             */
        }
    }

    /**
     * logout and remove the user...
     */
    doLogout() {
        console.log('%s:doLogout()', this.CLASS_NAME);

        firebase.auth().signOut().then(() => {
            // Sign-out successful.
        }, (error) => {
            // this.error = error
            console.log(error);
        });
        // this._authUserBehaviorSubject$.next(null)
    }

    private createSignedInUser(
        user: firebase.User
    ): SignedInUser {
        const result: SignedInUser = new SignedInUser(
            {
                email: user.email,
                firebaseDisplayName: user.displayName,
                userId: user.uid,
            }
        );

        return result;
    }
}
