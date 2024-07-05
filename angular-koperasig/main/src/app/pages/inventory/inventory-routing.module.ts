import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInventoryComponent } from './create-inventory/create-inventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { UpdateInventoryComponent } from './update-inventory/update-inventory.component';

const routes: Routes = [
    { path: 'create-inventory', component: CreateInventoryComponent },
    { path: 'inventory-list', component: InventoryListComponent },
    { path: 'update-inventory/:id', component: UpdateInventoryComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
