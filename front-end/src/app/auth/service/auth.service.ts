import { Injectable } from "@angular/core";
import * as auth0 from "auth0-js";

@Injectable({
    providedIn: "root"
})

export class AuthService {

  private databaseName = 'Chat-App';  
  private webAuth = new auth0.WebAuth({
    domain: 'dev-tjbvq8ijbol37y24.us.auth0.com',
    clientID: 'EcoPyWwfA8P1hZJ1AM4ohs39gGeTPAyo',           
    redirectUri: 'http://localhost:4200',   // must match the auth0 app callback
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  constructor() {
    this.handleAuthentication();
  }

  // Handle embedded username & password submit
  loginWithCredentials(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.webAuth.login({
        realm: this.databaseName,
        email: email,
        password: password
      }, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(authResult);
        }
      });
    });
  }

  // Add this method to your existing AuthService class
    signupWithCredentials(email: string, password: string): Promise<any> {
      return new Promise((resolve, reject) => {
        this.webAuth.signup({
          connection: this.databaseName, 
          email: email,
          password: password,
        }, (err, authResult) => {
          if (err) {
            reject(err);
          } else {
            resolve(authResult);
          }
        });
      });
    }


  
  private handleAuthentication(): void {
    this.webAuth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        console.log('Successfully logged in!', authResult);
      } else if (err) {
        console.error('Error parsing token hash', err);
      }
    });
  }
}