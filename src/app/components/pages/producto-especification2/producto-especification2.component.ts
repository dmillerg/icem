import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ transform: 'translateX(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);

const scaleAnimation = trigger('scaleAnimation', [
  transition(':enter', [
    style({ transform: 'scale(0)', opacity: 0 }),
    animate('500ms', style({ transform: 'scale(1)', opacity: 1 })),
  ]),
  transition(':leave', [
    style({ transform: 'scale(1)', opacity: 1 }),
    animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-producto-especification2',
  templateUrl: './producto-especification2.component.html',
  styleUrls: ['./producto-especification2.component.css'],
  animations: [listAnimation, scaleAnimation]
})
export class ProductoEspecification2Component implements OnInit {

  producto: Producto = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    categoria: -1,
    disponibilidad: 0,
    especificaciones: '',
    garantia: '',
    ficha: '',
    imagen: '',
    precio: 0,
    usos: '',
    activo: false,
  };
  categoria: string='';
  carrito: any[] = [];
  cantidad: number = 0;

  constructor(private api: ApiService, public storage: SessionStorageService) { }

  ngOnInit(): void {
    setInterval(() => {
      this.loadEspecification();
    }, 5000)
    if (this.storage.retrieve('producto')) {
      this.producto = this.storage.retrieve('producto');
      this.loadImageProducto(this.producto.id);
      this.storage.observe('producto').subscribe((result)=>{
        this.producto= result;
        this.loadImageProducto(this.producto.id);
      })
    }
  }

  loadImageProducto(id: number) {
    this.api.getProductoFoto(id).subscribe((result) => {
      this.producto.imagen = result.url;
      this.loadCategoria();
    }, error => {
      this.producto.imagen = error.url;
      this.loadCategoria();
    })
  }

  loadCategoria(){
    this.api.getCategoriaById(this.producto.categoria).subscribe((result) => {
      this.categoria = result.nombre;
    }, error => {
      this.categoria = error;
    })
  }

  cant(action: string) {
    if (action == 'more' && this.cantidad < this.producto.disponibilidad) {
      this.cantidad++;
    } else if (action == 'less' && this.cantidad > 0) {
      this.cantidad--;
    }
  }

  addCarrito() {
    let formData = new FormData();
    formData.append('user_id', this.storage.retrieve('usuario').id);
    formData.append('producto_id', this.producto.id.toString());
    formData.append('cantidad', this.cantidad.toString());
    formData.append('precio', this.producto.precio.toString());
    this.cantidad = 0
    this.api.addCarrito(formData).subscribe((result) => {
      this.loadEspecification();
      this.api.getCarrito(this.storage.retrieve('usuario').id).subscribe(result => {
        this.listarCarrito();
      })
    });
  }

  listarCarrito() {
    if (this.storage.retrieve('usuario')) {
      this.api.getCarrito(this.storage.retrieve('usuario').id).subscribe((result) => {
        console.log(result)
        this.carrito = result;
        this.carrito.forEach((e, i) => {
          this.getProductoFoto(e.producto_id, i);
        });
        this.storage.store('carrito', this.carrito);
      });
    }
  }

  getProductoFoto(id: number, position: number) {
    this.api.getProductoFoto(id).subscribe(result => {
    }, error => {
      this.carrito[position].url = error.url;
    })
  }

  loadEspecification() {
    this.api.getProductosById(this.producto.id).subscribe((result) => {
      if(result != null){
      this.producto.disponibilidad = result.disponibilidad;
      this.producto.precio = Number.isInteger(result.precio)?Number(result.precio+'.00'):result.precio;
      }
    });
  }

}
