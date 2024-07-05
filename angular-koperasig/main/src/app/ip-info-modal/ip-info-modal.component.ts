import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ip-info-modal',
  templateUrl: './ip-info-modal.component.html',
  //styleUrls: ['./ip-info-modal.component.css']
})
export class IpInfoModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { ipDhcp: string; ipStatic: string; macAddress: string }) {}
}
