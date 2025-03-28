import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedComponentsComponent } from './featured-components.component';

describe('FeaturedComponentsComponent', () => {
  let component: FeaturedComponentsComponent;
  let fixture: ComponentFixture<FeaturedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
