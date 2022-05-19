import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoEspecification2Component } from './producto-especification2.component';

describe('ProductoEspecification2Component', () => {
  let component: ProductoEspecification2Component;
  let fixture: ComponentFixture<ProductoEspecification2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoEspecification2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoEspecification2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
