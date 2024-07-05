import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { ProsesorRoutingModule } from './prosesor-routing.module';

import { CreateProsesorComponent } from './create-prosesor/create-prosesor.component';
import { ProsesorListComponent } from './prosesor-list/prosesor-list.component';
import { UpdateProsesorComponent } from './update-prosesor/update-prosesor.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/prosesor_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProsesorRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateProsesorComponent,
    ProsesorListComponent,
    UpdateProsesorComponent,
    ModalDialogComponent,
  ],
})
export class ProsesorModule {}
