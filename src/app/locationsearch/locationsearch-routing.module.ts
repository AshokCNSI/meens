import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsearchPage } from './locationsearch.page';

const routes: Routes = [
  {
    path: '',
    component: LocationsearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsearchPageRoutingModule {}
