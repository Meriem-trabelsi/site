import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PethomeComponent } from './pethome.component';

describe('PethomeComponent', () => {
  let component: PethomeComponent;
  let fixture: ComponentFixture<PethomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PethomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PethomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
