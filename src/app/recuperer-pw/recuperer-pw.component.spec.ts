import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecupererPWComponent } from './recuperer-pw.component';

describe('RecupererPWComponent', () => {
  let component: RecupererPWComponent;
  let fixture: ComponentFixture<RecupererPWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecupererPWComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecupererPWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
