import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMerkComponent } from './create-merk/create-merk.component';
import { MerkListComponent } from './merk-list/merk-list.component';
import { UpdateMerkComponent } from './update-merk/update-merk.component';

const routes: Routes = [
    { path: 'create-merk', component: CreateMerkComponent },
    { path: 'merk-list', component: MerkListComponent },
    { path: 'update-merk/:id_merk', component: UpdateMerkComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class MerkRoutingModule { }
