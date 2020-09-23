import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MysellingproductsPageRoutingModule } from './mysellingproducts-routing.module';

import { MysellingproductsPage } from './mysellingproducts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MysellingproductsPageRoutingModule
  ],
  declarations: [MysellingproductsPage]
})
export class MysellingproductsPageModule {}
