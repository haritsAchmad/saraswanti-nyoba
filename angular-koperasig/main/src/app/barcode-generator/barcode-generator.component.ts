import { Component } from '@angular/core';

@Component({
  selector: 'app-barcode-generator',
  templateUrl: './barcode-generator.component.html',
  //styleUrls: ['./barcode-generator.component.css']
})
export class BarcodeGeneratorComponent {
  barcodeData: string = '1234567890';
  format: string = 'CODE128';

  constructor() { }

  changeBarcodeData(newData: string) {
    this.barcodeData = newData;
  }
}
