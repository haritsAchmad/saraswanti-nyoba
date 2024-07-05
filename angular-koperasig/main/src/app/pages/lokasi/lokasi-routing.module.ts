import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateLokasiComponent } from './create-lokasi/create-lokasi.component';
import { LokasiListComponent } from './lokasi-list/lokasi-list.component';
import { UpdateLokasiComponent } from './update-lokasi/update-lokasi.component';

const routes: Routes = [
    { path: 'create-lokasi', component: CreateLokasiComponent },
    { path: 'lokasi-list', component: LokasiListComponent },
    { path: 'update-lokasi/:id_lokasi', component: UpdateLokasiComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class LokasiRoutingModule { }
