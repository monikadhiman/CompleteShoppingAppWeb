import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MycartComponent} from './mycart/mycart.component';
import {ProductdisplayComponent} from './productdisplay/productdisplay.component';
const routes: Routes = [
  { path: '', component: ProductdisplayComponent, pathMatch: 'full' },
  { path: 'productdisplay', component: ProductdisplayComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mycart', component: MycartComponent },
  { path: '**', component: ProductdisplayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
