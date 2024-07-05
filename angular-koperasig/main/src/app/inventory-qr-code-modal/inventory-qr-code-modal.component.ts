import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory-qr-code-modal',
  templateUrl: './inventory-qr-code-modal.component.html',
  styleUrls: ['./inventory-qr-code-modal.component.scss']
})
export class InventoryQrCodeModalComponent {
  @Input() qrCodeData: string = '';

  constructor(
    public dialogRef: MatDialogRef<InventoryQrCodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.qrCodeData = data.qrCodeData;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
