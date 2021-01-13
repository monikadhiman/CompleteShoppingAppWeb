import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
//import { Http, Response } from '@angular/http';
import { Observable, of, throwError, pipe } from "rxjs"
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
//import { AuthenticationService } from './authentication.service';
import { OrderDetail } from '../Models/OrderDetail.Model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public apiURL: string = "http://localhost:49911/api/OrderDetails/CreateOrder";
  constructor(private httpClient: HttpClient) { }

  PlaceOrder(orderDetail: OrderDetail) {
    // var reqHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.getToken() });
    // reqHeader.append('Content-Type', 'application/json');

    return this.httpClient.post(this.apiURL, orderDetail)
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
  }
}
