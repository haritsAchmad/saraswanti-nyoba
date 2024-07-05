import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { RamRoutingModule } from './ram-routing.module';

import { CreateRamComponent } from './create-ram/create-ram.component';
import { RamListComponent } from './ram-list/ram-list.component';
import { UpdateRamComponent } from './update-ram/update-ram.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/ram_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RamRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateRamComponent,
    RamListComponent,
    UpdateRamComponent,
    ModalDialogComponent,
  ],
})
export class RamModule {}
