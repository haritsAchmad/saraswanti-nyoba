import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowserMultiFormatReader, NotFoundException, Result } from '@zxing/library';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  //styleUrls: ['./barcode-scanner.component.css']
})
export class BarcodeScannerComponent implements OnInit, OnDestroy {
  codeReader = new BrowserMultiFormatReader();
  scannedResult: any;
  videoElement!: HTMLVideoElement;

  constructor() { }

  ngOnInit(): void {
    this.videoElement = document.getElementById('video') as HTMLVideoElement;
    this.startCamera();
  }

  startCamera(): void {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.srcObject = stream;
        this.videoElement.play();
      })
      .catch(err => {
        console.error('Error accessing the camera: ', err);
      });
  }

  startScanner(): void {
    this.codeReader.decodeFromVideoDevice(null, this.videoElement, (result, err) => {
      if (result) {
        this.scannedResult = JSON.parse(result.getText());
      } else if (err && !(err instanceof NotFoundException)) {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.codeReader.reset();
    if (this.videoElement.srcObject) {
      (this.videoElement.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  }
}
