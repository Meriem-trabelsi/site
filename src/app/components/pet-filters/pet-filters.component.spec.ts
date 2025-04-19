import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFiltersComponent } from './pet-filters.component';

describe('PetFiltersComponent', () => {
  let component: PetFiltersComponent;
  let fixture: ComponentFixture<PetFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
