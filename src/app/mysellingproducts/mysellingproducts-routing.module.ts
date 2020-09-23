import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MysellingproductsPage } from './mysellingproducts.page';

const routes: Routes = [
  {
    path: '',
    component: MysellingproductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MysellingproductsPageRoutingModule {}
