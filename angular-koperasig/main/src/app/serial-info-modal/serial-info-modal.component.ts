import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-serial-info-modal',
  templateUrl: './serial-info-modal.component.html',
  styleUrls: ['./serial-info-modal.component.scss']
})
export class SerialInfoModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { serial_number: string; serial_key_windows: string; storage: string; ram: string; }) {}
}
