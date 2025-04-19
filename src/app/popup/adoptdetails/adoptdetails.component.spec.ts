import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptdetailsComponent } from './adoptdetails.component';

describe('AdoptdetailsComponent', () => {
  let component: AdoptdetailsComponent;
  let fixture: ComponentFixture<AdoptdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
