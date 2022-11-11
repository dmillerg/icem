import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-producto',
  templateUrl: './table-producto.component.html',
  styleUrls: ['./table-producto.component.css'],
})
export class TableProductoComponent implements OnInit {
  @Input() productos: Producto[];
  categoria_query: number = -1;
  categorias: any[] = [];
  actividad_query: number = -1;
  fecha_query: string = '';
  fechas: any[] = [];
  all_query: string = '';

  constructor(private api: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadCategorias();
    this.loadProductos();
  }

  loadProductos() {
    this.api.getProducto().subscribe((result) => {
      if (result.length > 0) this.productos = result;
      else this.productos = [];
      result.forEach(item => {
        if(this.fechas.indexOf(item.fecha)==-1) this.fechas.push(item.fecha);
        // if(this.categorias.indexOf(item.categoria)==-1) this.categorias.push(item.categoria);
      })
    });
  }

  loadCategorias(){
    this.api.getCategorias().subscribe((result) => {
      if (result.length > 0) this.categorias = result;
      else this.categorias = [];
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

  activarProducto(item: Producto) {
    this.api.activarProducto(item.id, !item.activo).subscribe(result => {
      this.darPublicidadNuevoProducto(item);
      this.loadProductos();
    })
  }

  darPublicidadNuevoProducto(producto:any) {
    let asunto: string = 'Un nuevo producto ha sido puesto en venta'
    this.api.getUsuarios().subscribe(result => {
      result.forEach(e => {
        let mensaje: string = `Hola ${e.nombre}, hemos notado que te interesan los productos del tipo ${this.categorias.filter(i => i.id == producto.categoria)[0].nombre}, recientemente hemos agregado un nuevo producto a la venta y ya esta disponible para usted. No queríamos dejar pasar la oportunidad de notificarte acerca de la noticia, esperamos su visita. Gracias por tu preferencia. \n El nombre del producto es: "${producto.titulo}" `;
        if (e.ultima_compra_id == producto.categoria) {
          console.log('email enviado');

          this.api.sendEmail(e.correo,
            asunto, mensaje,
            '',
            'publicidad',
            `${environment.url_page}/#/productos?id=${producto.id}`,
            `${environment.url_page}/#/productos?id=${producto.id}`).subscribe(result2 => {

            });
        }
      });
    });
  }
}
