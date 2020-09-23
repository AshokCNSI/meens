import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationfinderPageRoutingModule } from './locationfinder-routing.module';

import { LocationfinderPage } from './locationfinder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationfinderPageRoutingModule
  ],
  declarations: [LocationfinderPage]
})
export class LocationfinderPageModule {}
