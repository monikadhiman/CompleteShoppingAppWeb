import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, pipe } from "rxjs"
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public apiURL: string = "http://localhost:49911/";
  constructor(private httpClient: HttpClient) { }
  storeRole(role: any) {
    this.removeRole();
    localStorage.setItem('role', JSON.stringify(role));
  }
  getRole() {
    // return localStorage.getItem("role");
    return JSON.parse(localStorage.getItem('role'));
  }
  removeRole() {
    return localStorage.removeItem("role");
  }
}
