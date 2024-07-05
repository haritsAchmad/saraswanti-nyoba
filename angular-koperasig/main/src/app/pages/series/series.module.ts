import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { SeriesRoutingModule } from './series-routing.module';

import { CreateSeriesComponent } from './create-series/create-series.component';
import { SeriesListComponent } from './series-list/series-list.component';
import { UpdateSeriesComponent } from './update-series/update-series.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/series_modal-dialog/modal-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SeriesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    QRCodeModule,
  ],
  declarations: [
    CreateSeriesComponent,
    SeriesListComponent,
    UpdateSeriesComponent,
    ModalDialogComponent,
  ],
})
export class SeriesModule {}
