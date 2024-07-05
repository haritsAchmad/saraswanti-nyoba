import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpInfoModalComponent } from './ip-info-modal.component';

describe('IpInfoModalComponent', () => {
  let component: IpInfoModalComponent;
  let fixture: ComponentFixture<IpInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpInfoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IpInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
