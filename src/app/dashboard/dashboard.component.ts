import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//import { AuthenticationService } from '../Services/authentication.service';
import { LoginService } from './../Services/login.service';
import { Product } from './../Models/Product.Model';
import { ProductService } from './../Services/product.service';
import { IAlert } from './../Models/IAlert';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  productForm: FormGroup;
  sellerName: string = "";
  sellerId: number = 0;
  productFormInputs: Product[];
  @Input()
  public alerts: Array<IAlert> = [];
  public globalResponse: any;
  productImage: File = null;
  address: string;
  constructor(private fb: FormBuilder, private productService: ProductService, private loginService: LoginService) { }

  ngOnInit(): void {

 //   console.warn(this.address);
    this.productForm = this.fb.group({
      Name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      Description: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      Address: ['', Validators.required],
      Price: ['', Validators.compose([Validators.required])],
      Category: ['', Validators.required],
      Quantity: ['', Validators.required],

      image: ['', Validators.required],
      Conditions: ['', ''],

    });
    this.GetSellerDetails();
  }
  GetSellerDetails() {
    let details = this.loginService.getProfile();
    console.log(details);
    this.sellerId = details["email"];
    this.sellerName = details["username"];

  }
  handleImageFile(file: FileList) {
    this.productImage = file.item(0);
  }
  OnSaveProduct() {
    let productFormInputs = this.productForm.value;
    productFormInputs.SellerId = this.sellerId;
    productFormInputs.SellerName = this.sellerName;
    productFormInputs.ImageFile = this.productImage;

    this.alerts = [];
    console.log(productFormInputs);
    this.productService.saveProductInfo(productFormInputs)
      .subscribe((result) => {
        this.globalResponse = result;

       console.warn(this.globalResponse);
        // tslint:disable-next-line: whitespace
        if (this.globalResponse === 1) {
          this.alerts = [];
          this.alerts.push({
            id: 1,
            type: 'success',
            message: 'Product added successful.',
          });
          localStorage.setItem('Address',this.productForm.value.Address);
           this.address = localStorage.getItem('Address');
           this.productForm.reset();
          // console.warn(this.productForm.controls.Address.setValue(this.address));
          this.productForm.controls.Address.setValue(this.address);
          this.productForm.controls.Category.setValue('', 'Select Category');

        }
        else {
          this.alerts = [];
          this.alerts.push({
            id: 2,
            type: 'danger',
            message: 'Product did not add'
          });
       }
      });
  }


    //     error => { //This is error part
    //       console.log(error.message);
    //       this.alerts.push({
    //         id: 2,
    //         type: 'danger',
    //         message: 'Something went wrong while saving the product, Please try after sometime.'
    //       });
    //     },
    //     () => {
    //       //  This is Success part
    //       // console.log(this.globalResponse);
    //       this.alerts.push({
    //         id: 1,
    //         type: 'success',
    //         message: 'Product has been saved successfully. Now you can add more prodcut , if you wish to.',
    //       });

    //     }
    //   )

  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
  clearMsg(event: any) {

    if (event.isTrusted === true) {

      this.alerts = [];
    }
  }
  reset()
  {
    this.productForm.reset();
    this.productForm.controls.Category.setValue('', 'Select Category');

  }
}
