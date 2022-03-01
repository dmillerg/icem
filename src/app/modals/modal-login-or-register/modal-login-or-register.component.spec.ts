import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoginOrRegisterComponent } from './modal-login-or-register.component';

describe('ModalLoginOrRegisterComponent', () => {
  let component: ModalLoginOrRegisterComponent;
  let fixture: ComponentFixture<ModalLoginOrRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLoginOrRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoginOrRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
