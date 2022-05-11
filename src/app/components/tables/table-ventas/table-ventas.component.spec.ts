import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePedidoComponent } from './table-ventas.component';

describe('TablePedidoComponent', () => {
  let component: TablePedidoComponent;
  let fixture: ComponentFixture<TablePedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablePedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
