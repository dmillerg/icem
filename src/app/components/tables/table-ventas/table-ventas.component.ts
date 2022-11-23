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
  selector: 'app-table-ventas',
  templateUrl: './table-ventas.component.html',
  styleUrls: ['./table-ventas.component.css'],
})
export class TableVentasComponent implements OnInit {

  @Input() ventas: any[];
  @Input() usuarios: Usuario[] = [];
  @Input() productos: Producto[] = [];
  user_id: number = -1;
  fecha: string = '';
  producto_id: number = -1;

  constructor(private api: ApiService, private modalService: NgbModal, private storage: SessionStorageService, private crud: CrudService) {
    crud.emitter.subscribe(result => {
      if (result == 'loadventas' || result == 'loadall') {
        this.loadUsuario();
        this.loadProductos();
        this.loadVentas();
      }
    })
   }

  ngOnInit(): void {
    this.loadUsuario();
    this.loadProductos();
    this.loadVentas();
  }

  loadVentas() {
    this.api.getVentas(this.user_id, this.fecha, this.producto_id).subscribe((result) => {
      if (result.length > 0) {
        this.ventas = result;
        result.forEach((e, i) => {
          this.getProductoFoto(e.producto_id, i);
          // this.ventas[i].usuario = this.usuarios.filter(r => r.id == e.user_id)[0].usuario;
        });
        console.log(this.ventas);
        
      }
      else this.ventas = [];
    });
  }

  getProductoFoto(id: number, position: number) {
    this.ventas[position].url=environment.url_backend+ `pictures/${id}?tipo=productos`
  }

  loadUsuario() {
    this.api.getUsuarios().subscribe((result) => {
      if (result.length > 0) {
        if (this.storage.retrieve('usuario').usuario != 'kuroko') {
          this.usuarios = result.filter((item) => item != result[0]);
        } else
          this.usuarios = result;
      } else this.usuarios = [];
    });
  }

  loadProductos() {
    this.api.getProducto().subscribe((result) => {
      if (result.length > 0) {
        this.productos = result;
      } else this.usuarios = [];
    });
  }

  change() {
    this.loadVentas();
  }
  
  delete(producto: Producto) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = producto.id;
    modal.componentInstance.modalHeader = 'Pedido';
    modal.result.then((result) => {
      if (result) {
        this.loadVentas();
      }
    });
  }

  cambiarEstadoPedido(pedido: Pedido) {
    let modal = this.modalService.open(ModalEstadoPedidoComponent, { backdrop: 'static' });
    modal.componentInstance.id = pedido.id;
    modal.componentInstance.estado = pedido.estado;
    modal.result.then(result => {
      if (result) {
        this.loadVentas();
      }
    })
  }

  generarReportes() {
    this.api.generarReportes(this.user_id, this.fecha, this.producto_id, 'ventas.xlsx').subscribe(result => {
      console.log(result);
      let filename = result.headers.get('content-disposition')?.split(';')[1].split('=')[1];
      let blob: Blob = result.body as Blob;
      let a = document.createElement('a');
      a.download = 'ventas.xlsx';
      a.href = window.URL.createObjectURL(blob)
      a.target = "_blank"
      a.click();
      this.api.deleteFile('ventas.xlsx').subscribe((result) => {
        console.log(result);

      })
    }, error => {
      console.log(error);

    })
  }
}
