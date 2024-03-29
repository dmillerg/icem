import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalEstadoPedidoComponent } from 'src/app/modals/modal-estado-pedido/modal-estado-pedido.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-pedido',
  templateUrl: './table-pedido.component.html',
  styleUrls: ['./table-pedido.component.css'],
})
export class TablePedidoComponent implements OnInit {

  @Input() pedidos: any[];
  @Input() usuarios: Usuario[] = [];
  user_id: number = -1;
  loading: boolean = false;
  loading_message: string = 'cargando...';

  constructor(private api: ApiService, private modalService: NgbModal, private storage: SessionStorageService, private crud: CrudService) {
    crud.emitter.subscribe(result => {
      if (result == 'loadpedidos' || result == 'loadall') {
        this.loadUsuario();
        this.loadPedidos();
      }
    })
  }

  ngOnInit(): void {
    this.loadUsuario();
    this.loadPedidos();
  }

  loadPedidos() {
    this.loading = true;
    this.api.getPedidos(this.user_id).subscribe((result) => {
      console.log(result);
      if (result.length > 0) {
        this.pedidos = result;
        result.forEach((e, i) => {
          this.getProductoFoto(e.producto_id, i);
          this.pedidos[i].usuario = this.usuarios.filter(r => r.id == this.user_id)[0].usuario;
        })
      }
      else this.pedidos = [];
      this.loading = this.pedidos.length == 0 ? true : false;
      this.loading_message = this.pedidos.length == 0 ? 'no hay pedidos registrados' : ''
    });
  }

  getProductoFoto(id: number, position: number) {
    this.pedidos[position].url = environment.url_backend + `pictures/${id}?tipo=productos`
  }

  loadUsuario() {
    this.api.getUsuarios().subscribe((result) => {
      if (result.length > 0) {
          this.usuarios = result;
      } else this.usuarios = [];
    });
  }

  change() {
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

  cambiarEstadoPedido(pedido: Pedido) {
    let modal = this.modalService.open(ModalEstadoPedidoComponent, { backdrop: 'static' });
    modal.componentInstance.id = pedido.id;
    modal.componentInstance.estado = pedido.estado;
    modal.result.then(result => {
      if (result) {
        this.loadPedidos();
      }
    })
  }
}
