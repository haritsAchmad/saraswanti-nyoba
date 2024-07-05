import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSeriesComponent } from './create-series/create-series.component';
import { SeriesListComponent } from './series-list/series-list.component';
import { UpdateSeriesComponent } from './update-series/update-series.component';

const routes: Routes = [
    { path: 'create-series', component: CreateSeriesComponent },
    { path: 'series-list', component: SeriesListComponent },
    { path: 'update-series/:id_series', component: UpdateSeriesComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
