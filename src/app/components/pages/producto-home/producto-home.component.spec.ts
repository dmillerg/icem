import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoHomeComponent } from './producto-home.component';

describe('ProductoHomeComponent', () => {
  let component: ProductoHomeComponent;
  let fixture: ComponentFixture<ProductoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
