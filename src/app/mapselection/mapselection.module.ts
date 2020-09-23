import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapselectionPageRoutingModule } from './mapselection-routing.module';

import { MapselectionPage } from './mapselection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapselectionPageRoutingModule
  ],
  declarations: [MapselectionPage]
})
export class MapselectionPageModule {}
