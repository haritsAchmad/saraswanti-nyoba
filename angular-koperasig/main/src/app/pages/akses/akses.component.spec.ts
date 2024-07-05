import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AksesComponent } from './akses.component';

describe('AksesComponent', () => {
  let component: AksesComponent;
  let fixture: ComponentFixture<AksesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AksesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AksesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
