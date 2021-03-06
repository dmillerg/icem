import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-producto',
  templateUrl: './table-producto.component.html',
  styleUrls: ['./table-producto.component.css'],
})
export class TableProductoComponent implements OnInit {
  @Input() productos: Producto[];
  constructor(private api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos() {
    this.api.getProducto().subscribe((result) => {
      if (result.length > 0) this.productos = result;
      else this.productos = [];
    });
  }

  updateProducto(producto) {
    let modal = this.modalService.open(ModalProductoComponent, { size: 'lg' });
    modal.componentInstance.modalHeader = 'Producto';
    modal.componentInstance.modalSubHeader = 'para la comercializacion y venta';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.producto = producto;
    modal.result.then((result) => {
      if (result) {
        this.loadProductos();
      }
    });
  }

  delete(producto: Producto) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = producto.id;
    modal.componentInstance.modalHeader = 'Productos';
    modal.result.then((result) => {
      if (result) {
        this.loadProductos();
      }
    });
  }

  activarProducto(item: Producto){
    this.api.activarProducto(item.id, !item.activo).subscribe(result=>{
      this.loadProductos();
    })
  }
}
