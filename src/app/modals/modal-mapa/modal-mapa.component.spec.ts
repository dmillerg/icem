import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMapaComponent } from './modal-mapa.component';

describe('ModalMapaComponent', () => {
  let component: ModalMapaComponent;
  let fixture: ComponentFixture<ModalMapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMapaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
