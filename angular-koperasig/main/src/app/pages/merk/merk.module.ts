import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { MerkRoutingModule } from './merk-routing.module';

import { CreateMerkComponent } from './create-merk/create-merk.component';
import { MerkListComponent } from './merk-list/merk-list.component';
import { UpdateMerkComponent } from './update-merk/update-merk.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/merk_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MerkRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateMerkComponent,
    MerkListComponent,
    UpdateMerkComponent,
    ModalDialogComponent,
  ],
})
export class MerkModule {}
