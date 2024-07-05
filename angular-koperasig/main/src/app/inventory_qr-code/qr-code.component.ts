import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  template: `
    <qrcode [qrdata]="qrData" [size]="qrSize"></qrcode>
  `,
  styles: []
})
export class QrCodeComponent {
  @Input() qrData: string = '';
  @Input() qrSize: number = 150; // Default size

  constructor() { }
}
