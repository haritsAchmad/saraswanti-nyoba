import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { CreateInventoryComponent } from './create-inventory/create-inventory.component';
import { BarangComponent } from './barang-list/barang.component';
//import { UpdateInventoryComponent } from './update-inventory/update-inventory.component';

const routes: Routes = [
    { path: 'barang-list', component: BarangComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class BarangRoutingModule { }
