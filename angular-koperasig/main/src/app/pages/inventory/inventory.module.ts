import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { InventoryRoutingModule } from './inventory-routing.module';

import { CreateInventoryComponent } from './create-inventory/create-inventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { UpdateInventoryComponent } from './update-inventory/update-inventory.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalDialogComponent } from 'src/app/inventory_modal-dialog/modal-dialog.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { QRCodeModule } from 'angularx-qrcode';
import localeDe from '@angular/common/locales/de';
import { NumberFormatPipe } from './number-format.pipe';
import { InventoryQrCodeModalComponent } from 'src/app/inventory-qr-code-modal/inventory-qr-code-modal.component';
import { IpInfoModalComponent } from 'src/app/ip-info-modal/ip-info-modal.component';
import { SerialInfoModalComponent } from 'src/app/serial-info-modal/serial-info-modal.component';

registerLocaleData(localeDe, 'de-DE');

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    InventoryRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    NgxBarcode6Module,
    QRCodeModule,
  ],
  declarations: [
    CreateInventoryComponent,
    InventoryListComponent,
    UpdateInventoryComponent,
    ModalDialogComponent,
    NumberFormatPipe,
    InventoryQrCodeModalComponent,
    IpInfoModalComponent,
    SerialInfoModalComponent,
  ],
  providers: [
    DecimalPipe,
  ],
})
export class InventoryModule {}
