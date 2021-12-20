import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEspecificacionComponent } from './productos-especificacion.component';

describe('ProductosEspecificacionComponent', () => {
  let component: ProductosEspecificacionComponent;
  let fixture: ComponentFixture<ProductosEspecificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosEspecificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosEspecificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
