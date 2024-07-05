import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSeries_printComponent } from './create-series_print/create-series_print.component';
import { Series_printListComponent } from './series_print-list/series_print-list.component';
import { UpdateSeries_printComponent } from './update-series_print/update-series_print.component';

const routes: Routes = [
    { path: 'create-series_print', component: CreateSeries_printComponent },
    { path: 'series_print-list', component: Series_printListComponent },
    { path: 'update-series_print/:id', component: UpdateSeries_printComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class Series_printRoutingModule { }
