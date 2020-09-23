import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockdetailPageRoutingModule } from './stockdetail-routing.module';

import { StockdetailPage } from './stockdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
	ReactiveFormsModule,
    IonicModule,
    StockdetailPageRoutingModule
  ],
  declarations: [StockdetailPage]
})
export class StockdetailPageModule {}
