import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueriesPageRoutingModule } from './queries-routing.module';

import { QueriesPage } from './queries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QueriesPageRoutingModule
  ],
  declarations: [QueriesPage]
})
export class QueriesPageModule {}
