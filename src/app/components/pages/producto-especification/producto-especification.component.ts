import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

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
  selector: 'app-producto-especification',
  templateUrl: './producto-especification.component.html',
  styleUrls: ['./producto-especification.component.css'],
  animations: [listAnimation, scaleAnimation]
})
export class ProductoEspecificationComponent implements OnInit {

  producto: any = {
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
    url: '',
  };
  categoria: string = '';
  carrito: any[] = [];
  cantidad: number = 0;
  imagenes: string[] = [];

  cinco_estrellas: number = 0;
  cuatro_estrellas: number = 0;
  tres_estrellas: number = 0;
  dos_estrellas: number = 0;
  uno_estrellas: number = 0;
  all_estrellas: number = 0;
  promedio: number = 0;

  constructor(private api: ApiService, public storage: SessionStorageService) { }

  ngOnInit(): void {
    this.loadPost();
    setInterval(() => {
      this.loadEspecification();
      // this.loadPost()
    }, 5000)
    if (this.storage.retrieve('producto')) {
      this.producto = this.storage.retrieve('producto');
      this.loadImageProducto(this.producto.id);
      this.storage.observe('producto').subscribe((result) => {
        this.loadPost();
        if (result != undefined && result != null) {


          this.producto = result;
          this.loadImageProducto(this.producto.id);
        }
      })
    }
  }

  cambiarVista(position: number) {
    // console.log(this.producto.url != this.imagenes[position]);

    if (this.producto.url != this.imagenes[position]) {
      let medio = this.producto.url;
      this.producto.url = this.imagenes[position];
      this.imagenes[position] = medio;
    }
  }

  loadImageProducto(id: number) {
    this.imagenes = [];
    this.producto.imagen.split(',').forEach((e, i) => {
      if (i == 0) {
        this.producto.url = environment.url_backend + `pictures/${this.producto.id}?tipo=productos`;
      } else {
        this.imagenes.push(environment.url_backend + `pictures/${this.producto.id}?tipo=productos&name=${e}`);
      }
    });
    this.loadCategoria();
  }

  loadCategoria() {
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
    if (this.storage.retrieve('producto')) {
      this.api.getProductosById(this.producto.id).subscribe((result) => {
        if (result != null) {
          this.producto.disponibilidad = result.disponibilidad;
          this.producto.precio = Number.isInteger(result.precio) ? Number(result.precio + '.00') : result.precio;
        }
      });
    }
  }

  collapse(id: string) {
    let collap = document.getElementById(id.toString());
    collap.classList.toggle('active');
    let content = document.getElementById(id + 'content');
    content.classList.toggle('active');
  }

  loadPost() {
    if (this.storage.retrieve('producto')) {
      this.cinco_estrellas = 0
      this.cuatro_estrellas = 0
      this.tres_estrellas = 0
      this.dos_estrellas = 0
      this.uno_estrellas = 0
      this.all_estrellas = 0
      this.promedio = 0

      this.api.getPosts(this.storage.retrieve('producto').id).subscribe(result => {
        if (result.length > 0) {
          this.cinco_estrellas = result.filter(e => e.calificacion == 5).length;
          this.cuatro_estrellas = result.filter(e => e.calificacion == 4).length;
          this.tres_estrellas = result.filter(e => e.calificacion == 3).length;
          this.dos_estrellas = result.filter(e => e.calificacion == 2).length;
          this.uno_estrellas = result.filter(e => e.calificacion == 1).length;
          this.all_estrellas = result.length;
          this.promedio = Math.round(((this.cinco_estrellas * 5 + this.cuatro_estrellas * 4 + this.tres_estrellas * 3 + this.dos_estrellas * 2 + this.uno_estrellas * 1) / this.all_estrellas) * 10) / 10;
          this.cinco_estrellas = isNaN((this.cinco_estrellas / this.all_estrellas) * 100) ? 100 : (this.cinco_estrellas / this.all_estrellas) * 100
          this.cuatro_estrellas = isNaN((this.cuatro_estrellas / this.all_estrellas) * 100) ? 100 : (this.cuatro_estrellas / this.all_estrellas) * 100
          this.tres_estrellas = isNaN((this.tres_estrellas / this.all_estrellas) * 100) ? 100 : (this.tres_estrellas / this.all_estrellas) * 100
          this.dos_estrellas = isNaN((this.dos_estrellas / this.all_estrellas) * 100) ? 100 : (this.dos_estrellas / this.all_estrellas) * 100
          this.uno_estrellas = isNaN((this.uno_estrellas / this.all_estrellas) * 100) ? 100 : (this.uno_estrellas / this.all_estrellas) * 100
        }
      });
    }
  }
}
