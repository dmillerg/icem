import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-pedido',
  templateUrl: './table-pedido.component.html',
  styleUrls: ['./table-pedido.component.css'],
})
export class TablePedidoComponent implements OnInit {

  @Input() pedidos: any[];
  @Input() usuarios: Usuario[]=[];
  user_id: number = -1;

  constructor(private api: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadUsuario();
    this.loadPedidos();
  }

  loadPedidos() {
    this.api.getPedidos(this.user_id).subscribe((result) => {
      console.log(result);
      
      if (result.length > 0) {
        this.pedidos= result;
        result.forEach((e, i) => {
          this.getProductoFoto(e.producto_id, i);
          this.pedidos[i].usuario = this.usuarios.filter(r=>r.id==this.user_id)[0].usuario;
        })
      }
      else this.pedidos = [];
    });
  }

  getProductoFoto(id: number, position: number) {
    this.api.getProductoFoto(id).subscribe(result => {
    }, error => {
      this.pedidos[position].url = error.url;
    })
  }

  loadUsuario() {
    this.api.getUsuarios().subscribe((result) => {
      if (result.length > 0) {
        this.usuarios = result.filter((item) => item != result[0]);
      } else this.usuarios = [];
    });
  }

  change(){
    console.log(this.user_id);
    
    this.loadPedidos();
  }
  // updateProducto(producto) {
  //   let modal = this.modalService.open(ModalProductoComponent, { size: 'lg' });
  //   modal.componentInstance.modalHeader = 'Producto';
  //   modal.componentInstance.modalSubHeader = 'para la comercializacion y venta';
  //   modal.componentInstance.modalAction = 'Editar';
  //   modal.componentInstance.producto = producto;
  //   modal.result.then((result) => {
  //     if (result) {
  //       this.loadProductos();
  //     }
  //   });
  // }

  delete(producto: Producto) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = producto.id;
    modal.componentInstance.modalHeader = 'Pedido';
    modal.result.then((result) => {
      if (result) {
        this.loadPedidos();
      }
    });
  }
}
