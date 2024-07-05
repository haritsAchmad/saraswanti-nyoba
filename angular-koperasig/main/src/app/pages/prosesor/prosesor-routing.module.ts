import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProsesorComponent } from './create-prosesor/create-prosesor.component';
import { ProsesorListComponent } from './prosesor-list/prosesor-list.component';
import { UpdateProsesorComponent } from './update-prosesor/update-prosesor.component';

const routes: Routes = [
    { path: 'create-prosesor', component: CreateProsesorComponent },
    { path: 'prosesor-list', component: ProsesorListComponent },
    { path: 'update-prosesor/:id_prosesor', component: UpdateProsesorComponent } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() here
  exports: [RouterModule]
})
export class ProsesorRoutingModule { }
