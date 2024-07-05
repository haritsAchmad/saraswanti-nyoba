import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { LokasiRoutingModule } from './lokasi-routing.module';

import { CreateLokasiComponent } from './create-lokasi/create-lokasi.component';
import { LokasiListComponent } from './lokasi-list/lokasi-list.component';
import { UpdateLokasiComponent } from './update-lokasi/update-lokasi.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/lokasi_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LokasiRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateLokasiComponent,
    LokasiListComponent,
    UpdateLokasiComponent,
    ModalDialogComponent,
  ],
})
export class LokasiModule {}
