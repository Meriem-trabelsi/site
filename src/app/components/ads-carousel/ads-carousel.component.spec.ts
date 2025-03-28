import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsCarouselComponent } from './ads-carousel.component';

describe('AdsCarouselComponent', () => {
  let component: AdsCarouselComponent;
  let fixture: ComponentFixture<AdsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
