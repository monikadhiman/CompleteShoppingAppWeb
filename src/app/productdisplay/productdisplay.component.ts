
import { LoginService } from '../Services/login.service';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ProductDisplay } from '../Models/ProductDisplay.Model';

import { ProductService } from '../Services/product.service';

import { IAlert } from '../Models/IAlert';

import { SharedService } from './../Services/shared.service';
import { Product } from './../Models/Product.Model';




@Component({
  selector: 'app-productdisplay',
  templateUrl: './productdisplay.component.html',
  styleUrls: ['./productdisplay.component.scss']
})
export class ProductdisplayComponent implements OnInit {
  public alerts: Array<IAlert> = [];
  cartItemCount: number = 0;
  @Output() cartEvent = new EventEmitter<number>();
  public globalResponse: any;
  yourByteArray: any;
  allProducts: ProductDisplay[];
  productAddedTocart: Product[];
  CustomerName: string;
  Phone: string;
  Email: string;
  loginStatus: boolean ;
  constructor(private loginService: LoginService, private productService: ProductService, private sharedService: SharedService) { }

  ngOnInit(): void {

    this.productService.getAllProducts()
      .subscribe((result) => {
        this.globalResponse = result;

      },
        error => { //This is error part
          console.log(error.message);
        },
        () => {
          //  This is Success part
          console.log("Product fetched sucssesfully.");
          //console.log(this.globalResponse);
          this.allProducts = this.globalResponse;
          console.warn(this.allProducts);
          this.GetDetails();
        }
      )

  }
  GetDetails() {
    let details = this.loginService.getProfile();
    console.log(details);
    if(details != null)
    {
      this.loginStatus = true;
      this.Email = details["email"];
      this.CustomerName = details["username"];
      this.Phone = details["phone"];
      console.warn(this.loginStatus);
    }
    else
    {
      this.loginStatus = false;
      console.warn(this.loginStatus);
    }
    }
  OnAddCart(product: Product) {


     if (this.productAddedTocart == null) {
     this.productAddedTocart = [];
      this.productAddedTocart.push(product);
       console.warn("hi", this.productAddedTocart);
      this.productService.addProductToCart(this.productAddedTocart);
      this.alerts.push({
        id: 1,
        type: 'success',
        message: 'Product added to cart.'
      });
      setTimeout(() => {
        this.closeAlert(this.alerts);
      }, 3000);

  }
    else {
       this.productAddedTocart = this.productService.getProductFromCart();
       console.warn("jfggj", this.productService.getProductFromCart());
      let tempProduct = null;
      for (let pro of this.productAddedTocart)
      {
        if(Number(pro.Id) === product.Id)
        {
          tempProduct = "1";
        }
      }
        if (tempProduct == null)
        {
        this.productAddedTocart.push(product);
        this.productService.addProductToCart(this.productAddedTocart);
        this.alerts.push({
          id: 1,
          type: 'success',
          message: 'Product added to cart.'
        });
        //setTimeout(function(){ }, 2000);
        setTimeout(() => {
          this.closeAlert(this.alerts);
        }, 3000);
      }
      else
      {
          this.alerts.push({
          id: 2,
          type: 'warning',
          message: 'Product already exist in cart.'
        });
        setTimeout(() => {
          this.closeAlert(this.alerts);
        }, 3000);
      }




  }
    //console.log(this.cartItemCount);
    this.cartItemCount = this.productAddedTocart.length;

    // this.cartEvent.emit(this.cartItemCount);
    this.sharedService.updateCartCount(this.cartItemCount);
    //console.warn(this.cartItemCount);
  }
  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
  remove()
  {
    this.productService.removeAllProductFromCart();
  }
}
