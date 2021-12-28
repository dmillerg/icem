import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScrapPruebaComponent } from './modal-scrap-prueba.component';

describe('ModalScrapPruebaComponent', () => {
  let component: ModalScrapPruebaComponent;
  let fixture: ComponentFixture<ModalScrapPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalScrapPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalScrapPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
