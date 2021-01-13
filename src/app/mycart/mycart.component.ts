import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Product } from '../Models/Product.Model';
import { ProductService } from '../Services/product.service';
import { IAlert } from '../Models/IAlert';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Registration } from '../Models/User.Models';
import { OrderDetail } from './../Models/OrderDetail.Model';
import { OrderItem } from './../Models/OrderItem.Model';
import { OrderService } from './../Services/order.service';
import { LoginService } from './../Services/login.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.scss']
})
export class MycartComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  dafualtQuantity: number = 1;
  productAddedTocart: Product[];
  allTotal: number;
  currentUser: Registration[];
  orderDetail: OrderDetail;
  orderItem: OrderItem[];
  CustomerName: string;
  Phone: string;
  Email: string ;
  loginStatus: boolean = false;
  Role: string;
  public globalResponse: any;
  public alerts: Array<IAlert> = [];

  deliveryForm: FormGroup;


  constructor(private router: Router,private productService: ProductService, private fb: FormBuilder, private orderService: OrderService, private loginService: LoginService, private authenticationService:AuthenticationService) {

  }

  ngOnInit() {
   
    this.GetDetails();
    this.productAddedTocart = this.productService.getProductFromCart();
    for (let i in this.productAddedTocart) {
      this.productAddedTocart[i].Quantity = 1;
    }
    this.productService.removeAllProductFromCart();
    this.productService.addProductToCart(this.productAddedTocart);
    this.calculteAllTotal(this.productAddedTocart);

    this.GetLoggedinUserDetails();

    this.deliveryForm = this.fb.group({
      UserName: ['', [Validators.required]],
      DeliveryAddress: ['', [Validators.required]],
      Phone: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      Message: ['', []],
      Amount: ['', [Validators.required]],

    });

    this.deliveryForm.controls['UserName'].setValue(this.CustomerName);
    this.deliveryForm.controls['Phone'].setValue(this.Phone);
    this.deliveryForm.controls['Email'].setValue(this.Email);
    this.deliveryForm.controls['Amount'].setValue(this.allTotal);

    this.initConfig();
  }
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'INR',
      clientId: 'AcVWL5a8IkHFHb5BTcksXboHU2sLGQukPdlINgRoeGLrTjy45FiS_HH0UjLc9oabT_KLufaAZLtzN955',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'INR',
              value: this.allTotal.toString(),
              breakdown: {
                item_total: {
                  currency_code: 'INR',
                  value: this.allTotal.toString()
                }
              }
            },
            items: [
              {
                name: 'My Shopping App',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'INR',
                  value: this.allTotal.toString(),
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        const date: Date = new Date();
        var id = this.Email;
        var name = this.CustomerName;
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        var seconds = date.getSeconds();
        var dateTimeStamp = day.toString() + monthIndex.toString() + year.toString() + minutes.toString() + hours.toString() + seconds.toString();
        let orderDetail: any = {};

        //Orderdetail is object which hold all the value, which needs to be saved into database
        orderDetail.CustomerId = this.Email;
        orderDetail.CustomerName = this.deliveryForm.controls['UserName'].value;
        orderDetail.DeliveryAddress = this.deliveryForm.controls['DeliveryAddress'].value;
        orderDetail.Phone = this.deliveryForm.controls['Phone'].value;

        orderDetail.PaymentRefrenceId = id + "-" + name + dateTimeStamp;
        orderDetail.OrderPayMethod = "Online Payment";

        //Assigning the ordered item details
        this.orderItem = [];
        for (let i in this.productAddedTocart) {
          this.orderItem.push({
            ID: 0,
            ProductID: this.productAddedTocart[i].Id,
            SellerID: this.productAddedTocart[i].SellerId,
            ProductName: this.productAddedTocart[i].Name,
            OrderedQuantity: this.productAddedTocart[i].Quantity,
            PerUnitPrice: this.productAddedTocart[i].UnitPrice,
            OrderID: 0,
          });
        }
        //So now compelte object of order is
        orderDetail.OrderItems = this.orderItem;



        this.orderService.PlaceOrder(orderDetail)
          .subscribe((result) => {
            this.globalResponse = result;
          },
            error => { //This is error part
              console.log(error.message);
              this.alerts.push({
                id: 2,
                type: 'danger',
                message: 'Something went wrong while placing the order, Please try after sometime.'
              });
            },
            () => {
              //  This is Success part
              //console.log(this.globalResponse);
              this.alerts.push({
                id: 1,
                type: 'success',
                message: 'Order has been placed succesfully.',
              });

            }
          )
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        //this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
  GetDetails() {
    let details = this.loginService.getProfile();
    console.log(details);
    if (details != null) {
      this.loginStatus = true;
      this.Email = details["email"];
      this.CustomerName = details["username"];
      this.Phone = details["phone"];
      this.Role = details["role"];
    }
    else{
      this.router.navigate(['productdisplay']);
    }
    
  }
   //this.router.navigate(['productdisplay']);
  onAddQuantity(product: Product) {
    //Get Product
    this.productAddedTocart = this.productService.getProductFromCart();
    this.productAddedTocart.find(p => p.Id == product.Id).Quantity = product.Quantity + 1;
    //Find produc for which we want to update the quantity
    //let tempProd= this.productAddedTocart.find(p=>p.Id==product.Id);  
    //tempProd.Quantity=tempProd.Quantity+1;

    //this.productAddedTocart=this.productAddedTocart.splice(this.productAddedTocart.indexOf(product), 1)
    //Push the product for cart
    // this.productAddedTocart.push(tempProd);
    this.productService.removeAllProductFromCart();
    this.productService.addProductToCart(this.productAddedTocart);
    this.calculteAllTotal(this.productAddedTocart);
    this.deliveryForm.controls['Amount'].setValue(this.allTotal);

  }
  onRemoveQuantity(product: Product) {
    this.productAddedTocart = this.productService.getProductFromCart();
    this.productAddedTocart.find(p => p.Id == product.Id).Quantity = product.Quantity - 1;
    this.productService.removeAllProductFromCart();
    this.productService.addProductToCart(this.productAddedTocart);
    this.calculteAllTotal(this.productAddedTocart);
    this.deliveryForm.controls['Amount'].setValue(this.allTotal);

  }
  calculteAllTotal(allItems: Product[]) {
    let total = 0;
    for (let i in allItems) {
      total = total + (allItems[i].Quantity * allItems[i].UnitPrice);
    }
    this.allTotal = total;
  }

  GetLoggedinUserDetails() {
    // this.currentUser = this.authService.getRole();

  }
  ConfirmOrder() {
    
    

  }
  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

}
