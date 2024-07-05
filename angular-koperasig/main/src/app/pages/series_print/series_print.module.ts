import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { Series_printRoutingModule } from './series_print-routing.module';

import { CreateSeries_printComponent } from './create-series_print/create-series_print.component';
import { Series_printListComponent } from './series_print-list/series_print-list.component';
import { UpdateSeries_printComponent } from './update-series_print/update-series_print.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/series_print_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Series_printRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateSeries_printComponent,
    Series_printListComponent,
    UpdateSeries_printComponent,
    ModalDialogComponent,
  ],
})
export class Series_printModule {}
