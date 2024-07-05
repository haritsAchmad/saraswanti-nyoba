import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { kategoriRoutingModule } from './kategori-routing.module';

import { CreateKategoriComponent } from './create-kategori/create-kategori.component';
import { KategoriListComponent } from './kategori-list/kategori-list.component';
import { UpdateKategoriComponent } from './update-kategori/update-kategori.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/kategori_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    kategoriRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateKategoriComponent,
    KategoriListComponent,
    UpdateKategoriComponent,
    ModalDialogComponent,
  ],
})
export class KategoriModule {}
