import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialInfoModalComponent } from './serial-info-modal.component';

describe('SerialInfoModalComponent', () => {
  let component: SerialInfoModalComponent;
  let fixture: ComponentFixture<SerialInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerialInfoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerialInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
