import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationfinderPage } from './locationfinder.page';

const routes: Routes = [
  {
    path: '',
    component: LocationfinderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationfinderPageRoutingModule {}
