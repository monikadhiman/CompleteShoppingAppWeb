import { LoginService } from './Services/login.service';
import { SharedService } from './Services/shared.service';
import { Input, Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Registration } from './Models/User.Models';
import { RegistrationService } from './Services/Registration.Service';
import { RouterModule, Router } from '@angular/router';
import {
  SocialUser,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';

import { from } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SocialAuthService } from 'angularx-social-login';
import { AuthenticationService } from './Services/authentication.service';
import { Product } from './Models/Product.Model';
import { ProductService } from './Services/product.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [RegistrationService]
})
export class AppComponent implements OnInit {
  profile: any;
  loginUser: string = '';
  status: boolean;
  closeResult: string;
  registrationForm: FormGroup;
  loginForm: FormGroup;
  registrationInputs: Registration[];
  currentUser: Registration[];
  // tslint:disable-next-line: no-inferrable-types
  isLoggedIn: boolean = false;

  // tslint:disable-next-line: no-inferrable-types
  cartItemCount: number = 0;
  // tslint:disable-next-line: no-inferrable-types
  approvalText: string = '';

  @Input()
  public alerts: Array<IAlert> = [];
  user: SocialUser;
  message = '';
  public globalResponse: any;
  window: any;


  // tslint:disable-next-line: max-line-length
  constructor(private pro: ProductService,private authenticationService: AuthenticationService,private sharedService: SharedService,private router: Router, private authService: SocialAuthService, private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder, private regService: RegistrationService) {

  }
  ngOnInit(): void {
    this.signOut();
    this.sharedService.currentMessage.subscribe(msg => this.cartItemCount = msg);

    console.warn(this.cartItemCount);
    this.registrationForm = this.fb.group({
      UserName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      Password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      ConfirmPassword: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required, Validators.email])],
      Role: ['', Validators.required],
      Phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      Gender: ['', Validators.required],
    },
      {
        validator: this.MustMatch('Password', 'ConfirmPassword')
      }
    );
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }

  open(content): void {
    this.alerts = [];
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  Login(): void {
    const data = this.loginForm.value;
    this.isLoggedIn = false;
    this.alerts = [];
    this.loginService.LoginUser(data)
      .subscribe((result: any) => {
        this.globalResponse = result;
        console.log(this.globalResponse);
        if (result.length > 0) {
          if (this.globalResponse[0].role == 'Sellers') {
            const userData = {
              'username': this.globalResponse[0].username,
              'password': null,
              'email': this.globalResponse[0].email,
              'role': 'Sellers',
              'gender': this.globalResponse[0].gender,
              'phone': this.globalResponse[0].phone
           }
            this.loginService.addProfile(userData);
            this.showProfile();
            this.router.navigate(['dashboard']);
            this.modalService.dismissAll();
          }
          else if (this.globalResponse[0].role == 'Customer') {
            const userData = {
              'username': this.globalResponse[0].username,
              'password': null,
              'email': this.globalResponse[0].email,
              'role': 'Customer',
              'gender': this.globalResponse[0].gender,
              'phone': this.globalResponse[0].phone
            }
            this.loginService.addProfile(userData);
            this.showProfile();
            this.router.navigate(['productdisplay']);
            this.modalService.dismissAll();
          }
          else {

            this.router.navigate(['productdisplay']);
            this.modalService.dismissAll();
          }
        }
        else {
          this.alerts = [];
          this.alerts.push({
            id: 1,
            type: 'warning',
            message: 'Invalid Credentials.',

          });
          this.loginForm.reset();
        }
      });
  }
  // tslint:disable-next-line: typedef
  GetClaims() {
          //let a = this.globalResponse;
          this.currentUser = this.globalResponse;
          this.authenticationService.storeRole(this.currentUser);


  }
  OnRegister(): void {
    this.registrationInputs = this.registrationForm.value;

    console.log(this.registrationInputs);
    this.regService.RegisterUser(this.registrationInputs)
      .subscribe((result) => {
        this.globalResponse = result;
        console.warn(this.globalResponse);
        // tslint:disable-next-line: whitespace
        if (this.globalResponse === 1) {
          this.alerts = [];
          this.alerts.push({
            id: 1,
            type: 'success',
            message: 'Registration successful.',
          });
          this.registrationForm.reset();
          this.registrationForm.controls.Role.setValue('', 'Select Role');
          this.registrationForm.controls.Gender.setValue('', 'Select Gender');
        }
        else if (this.globalResponse === 'Exists') {
          this.alerts = [];
          this.alerts.push({
            id: 2,
            type: 'danger',
            message: 'Registration failed with Duplicate Entry'
          });
        }
        else {
          this.alerts = [];
          this.alerts.push({
            id: 3,
            type: 'danger',
            message: 'Registration failed with Duplicate Entry' + this.globalResponse
          });
        }
      });
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  clearMsg(event: any) {

    if (event.isTrusted === true) {

      this.alerts = [];
    }
  }
  public closeAlert(alert: IAlert): void {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(socialuser => {
      console.log(socialuser)
      this.user = socialuser
      if (socialuser != null) {
        //console.log('user', this.user.name)
        const userData = {
          'username': this.user.name,
          'password': null,
          'email': this.user.email,
          'role': 'Customer',
          'gender': null,
          'phone': null
        }
        this.regService.RegisterUser(userData)
          .subscribe((result: any) => {
            this.globalResponse = result;
            if (this.globalResponse === 'Exists') {
              //console.warn('existts');
              this.loginService.addProfile(userData);
              this.showProfile();
              this.modalService.dismissAll();

            }

            this.router.navigate(['productdisplay']);
          });
      }
      else {
        console.warn("Either you don't have account in Facebook or internet connection problem");
      }
    });
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialuser => {
     // console.log(socialuser);
      this.user = socialuser
      if (socialuser != null) {
        //console.log('user', this.user.name)
        const userData = {
          'username': this.user.name,
          'password': null,
          'email': this.user.email,
          'role': 'Customer',
          'gender': null,
          'phone': null
        }
        this.regService.RegisterUser(userData)
          .subscribe((result: any) => {
            this.globalResponse = result;
            if (this.globalResponse === 'Exists') {
              //console.warn('existts');
              this.loginService.addProfile(userData);
              this.showProfile();
              this.modalService.dismissAll();
            }

            this.router.navigate(['productdisplay']);
          });
      }
      else {
        console.warn("Either you don't have account in Google or internet connection problem")
      }
    });
  }
  signOut(): void {
    this.loginUser='';
    this.loginService.removeProfile();
    this.pro.removeAllProductFromCart();
    this.authService.signOut();
    this.router.navigateByUrl('/');
   // this.window.location.href('/');

  }
  showProfile() {
    this.profile = this.loginService.getProfile();
    this.loginUser = this.profile.username + ' | Role:- '+ this.profile.role;
   //  console.warn(this.profile.username);

  }
  reset() {
    this.loginForm.reset();

    this.registrationForm.reset();
    this.registrationForm.controls.Role.setValue('', 'Select Role');
    this.registrationForm.controls.Gender.setValue('', 'Select Gender');
  }
  clearItem()
  {
    //this.sharedService.deleteCart();
  }
}

export interface IAlert {
  id: number;
  type: string;
  message: string;
}

