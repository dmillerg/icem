import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserResetPasswordComponent } from './modal-user-reset-password.component';

describe('ModalUserResetPasswordComponent', () => {
  let component: ModalUserResetPasswordComponent;
  let fixture: ComponentFixture<ModalUserResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUserResetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
