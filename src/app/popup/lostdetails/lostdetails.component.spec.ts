import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostdetailsComponent } from './lostdetails.component';

describe('LostdetailsComponent', () => {
  let component: LostdetailsComponent;
  let fixture: ComponentFixture<LostdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
