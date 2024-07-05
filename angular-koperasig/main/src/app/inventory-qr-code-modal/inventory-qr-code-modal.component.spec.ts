import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryQrCodeModalComponent } from './inventory-qr-code-modal.component';

describe('InventoryQrCodeModalComponent', () => {
  let component: InventoryQrCodeModalComponent;
  let fixture: ComponentFixture<InventoryQrCodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryQrCodeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryQrCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
