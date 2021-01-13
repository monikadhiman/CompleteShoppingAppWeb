import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import { Observable, of, throwError, pipe } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Registration } from './../Models/User.Models';
import {
  SocialUser,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';

import { from } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SocialAuthService } from 'angularx-social-login';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public apiURL = 'http://localhost:49911/api/Registration/LoginUser';
  constructor(private httpClient: HttpClient, private authService: SocialAuthService) { }

  // tslint:disable-next-line: typedef
  LoginUser(user: any) {
    return this.httpClient.post(this.apiURL, user)
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  // tslint:disable-next-line: typedef
  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
  }
  // getAllProducts() {
  //   return this.httpClient.get(this.apiURL)
  //     .pipe(
  //       map(res => res),
  //       catchError(this.errorHandler)
  //     );
  // }
  addProfile(reg: any) {
    localStorage.setItem("profile", JSON.stringify(reg));
    
  }
  getProfile() {
   // return localStorage.getItem("profile");
    return JSON.parse(localStorage.getItem('profile'));
  }
  removeProfile() {
    return localStorage.removeItem("profile");
  }
  
  }
  
