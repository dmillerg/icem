import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActivationComponent } from './modal-activation.component';

describe('ModalActivationComponent', () => {
  let component: ModalActivationComponent;
  let fixture: ComponentFixture<ModalActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalActivationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
