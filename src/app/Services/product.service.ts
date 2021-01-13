import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, pipe } from "rxjs"
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
//import { AuthenticationService } from './authentication.service';
import { Product } from '../Models/Product.Model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public apiURL: string = "http://localhost:49911/api/Product";
  constructor(private httpClient: HttpClient) { }

  saveProductInfo(product: any) {
    // var reqHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.getToken() });
    var reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();

    formData.append('Name', product.Name.toString());
    formData.append('Description', product.Description.toString());
    formData.append('BillingAddress', product['Address']);

    formData.append('UnitPrice', product['Price']);
    formData.append('Category', product.Category.toString());
    formData.append('Quantity', product.Quantity.toString());
    formData.append('Image', product['ImageFile']);
    formData.append('TC', product['Conditions']);

    formData.append('SellerId', product.SellerId.toString());
    formData.append('SellerName', product.SellerName.toString());





    return this.httpClient.post(this.apiURL + '/CreateProduct', formData)
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  getAllProducts() {
    return this.httpClient.get(this.apiURL)
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  addProductToCart(prodcuts: any) {
    localStorage.setItem("product", JSON.stringify(prodcuts));
  }
  getProductFromCart() {
    //return localStorage.getItem("product");
    return JSON.parse(localStorage.getItem('product'));
  }
  removeAllProductFromCart() {
    return localStorage.removeItem("product");
  }//
  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
  }
}
