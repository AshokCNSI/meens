import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationsearchPageRoutingModule } from './locationsearch-routing.module';

import { LocationsearchPage } from './locationsearch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationsearchPageRoutingModule
  ],
  declarations: [LocationsearchPage]
})
export class LocationsearchPageModule {}
