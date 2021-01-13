import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import { Observable, of, throwError, pipe} from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  public apiURL = 'http://localhost:49911/api/Registration/CreateUsers';
  constructor(private httpClient: HttpClient) { }

  // tslint:disable-next-line: typedef
  RegisterUser(user: any)
  {
    return this.httpClient.post(this.apiURL, user)
    .pipe(
      map(res => res),
       catchError( this.errorHandler)
      );
  }
  // tslint:disable-next-line: typedef
  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
}
}
