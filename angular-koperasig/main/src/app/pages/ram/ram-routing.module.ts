import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRamComponent } from './create-ram/create-ram.component';
import { RamListComponent } from './ram-list/ram-list.component';
import { UpdateRamComponent } from './update-ram/update-ram.component';

const routes: Routes = [
    { path: 'create-ram', component: CreateRamComponent },
    { path: 'ram-list', component: RamListComponent },
    { path: 'update-ram/:id_ram', component: UpdateRamComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class RamRoutingModule { }
