import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { StorageRoutingModule } from './storage-routing.module';

import { CreateStorageComponent } from './create-storage/create-storage.component';
import { StorageListComponent } from './storage-list/storage-list.component';
import { UpdateStorageComponent } from './update-storage/update-storage.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/storage_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StorageRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateStorageComponent,
    StorageListComponent,
    UpdateStorageComponent,
    ModalDialogComponent,
  ],
})
export class StorageModule {}
