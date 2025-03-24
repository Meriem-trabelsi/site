import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cart1Component } from './cart-1.component';

describe('Cart1Component', () => {
  let component: Cart1Component;
  let fixture: ComponentFixture<Cart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cart1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
