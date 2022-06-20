import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoEspecificationComponent } from './producto-especification.component';

describe('ProductoEspecificationComponent', () => {
  let component: ProductoEspecificationComponent;
  let fixture: ComponentFixture<ProductoEspecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoEspecificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoEspecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
