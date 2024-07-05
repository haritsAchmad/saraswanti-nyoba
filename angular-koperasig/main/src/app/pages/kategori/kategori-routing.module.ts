import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateKategoriComponent } from './create-kategori/create-kategori.component';
import { KategoriListComponent } from './kategori-list/kategori-list.component';
import { UpdateKategoriComponent } from './update-kategori/update-kategori.component';

const routes: Routes = [
    { path: 'create-kategori', component: CreateKategoriComponent },
    { path: 'kategori-list', component: KategoriListComponent },
    { path: 'update-kategori/:id_kategori', component: UpdateKategoriComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class kategoriRoutingModule { }
