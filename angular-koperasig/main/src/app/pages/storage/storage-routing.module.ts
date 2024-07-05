import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStorageComponent } from './create-storage/create-storage.component';
import { StorageListComponent } from './storage-list/storage-list.component';
import { UpdateStorageComponent } from './update-storage/update-storage.component';

const routes: Routes = [
    { path: 'create-storage', component: CreateStorageComponent },
    { path: 'storage-list', component: StorageListComponent },
    { path: 'update-storage/:id_storage', component: UpdateStorageComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class StorageRoutingModule { }
