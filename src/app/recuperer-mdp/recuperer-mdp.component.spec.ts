import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecupererMdpComponent } from './recuperer-mdp.component';

describe('RecupererMdpComponent', () => {
  let component: RecupererMdpComponent;
  let fixture: ComponentFixture<RecupererMdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecupererMdpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecupererMdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
