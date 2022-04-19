import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdminResetComponent } from './modal-admin-reset.component';

describe('ModalAdminResetComponent', () => {
  let component: ModalAdminResetComponent;
  let fixture: ComponentFixture<ModalAdminResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAdminResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdminResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
