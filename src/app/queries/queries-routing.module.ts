import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QueriesPage } from './queries.page';

const routes: Routes = [
  {
    path: '',
    component: QueriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueriesPageRoutingModule {}
