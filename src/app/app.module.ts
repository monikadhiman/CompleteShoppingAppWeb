import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider,FacebookLoginProvider } from 'angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductdisplayComponent } from './productdisplay/productdisplay.component';
import { MycartComponent } from './mycart/mycart.component';
import { NgxPayPalModule } from 'ngx-paypal';


// tslint:disable-next-line: typedef

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductdisplayComponent,
    MycartComponent,
  
  ],
  imports: [
    BrowserModule, NgbModule, FormsModule, ReactiveFormsModule, HttpClientModule,
    AppRoutingModule, SocialLoginModule, NgxPayPalModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '277757751177-l7fhpsgn1ul69m6hae7on86tg74jvrlj.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('277731613324293'),

          },
        ],
      } as SocialAuthServiceConfig,
    }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
