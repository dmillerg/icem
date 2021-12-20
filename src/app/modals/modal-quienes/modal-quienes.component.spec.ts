import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQuienesComponent } from './modal-quienes.component';

describe('ModalQuienesComponent', () => {
  let component: ModalQuienesComponent;
  let fixture: ComponentFixture<ModalQuienesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalQuienesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQuienesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
