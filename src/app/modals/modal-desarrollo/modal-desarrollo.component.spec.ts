import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDesarrolloComponent } from './modal-desarrollo.component';

describe('ModalDesarrolloComponent', () => {
  let component: ModalDesarrolloComponent;
  let fixture: ComponentFixture<ModalDesarrolloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDesarrolloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDesarrolloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
