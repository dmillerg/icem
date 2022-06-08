import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Categoria } from 'src/app/models/categoria';
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

const scaleAnimation = trigger(
  'scaleAnimation', [
  transition(':enter', [
    style({ transform: 'scale(0)', opacity: 0 }),
    animate('500ms', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'scale(1)', opacity: 1 }),
    animate('500ms', style({ transform: 'scale(0)', opacity: 0 }))
  ])
]
);

@Component({
  selector: 'app-productos2',
  templateUrl: './productos2.component.html',
  styleUrls: ['./productos2.component.css'],
  animations: [listAnimation, scaleAnimation]
})
export class Productos2Component implements OnInit {


  productos: Producto[] = [];
  productos_all: Producto[] = [];
  categorias: Categoria[] = [];
  categorias4: Categoria[] = [];
  posts: any[] = [];

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
  producto2: Producto = {
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
  categoria: Categoria = {
    id: -1,
    nombre: '',
    descripcion: '',
  };

  alias: string = '';
  correo: string = '';
  comentario: string = '';
  comentarios: boolean = false;

  categoriaId: number = -1;
  position: number = 4;

  constructor(private api: ApiService, public storage: SessionStorageService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadCategorias();
    this.loadProductos();
    this.cargaInicial();
    this.cargaInicial2();
    if (this.storage.retrieve('categoria')) {
      this.categoria = this.storage.retrieve('categoria');
      this.categoriaId = this.categoria.id;
      this.loadProductos();
      this.storage.observe('categoria').subscribe((result) => {
        if (result.id != this.categoria.id) {
          this.categoria = result;
          this.categoriaId = this.categoria.id;
          this.producto = this.producto2;
          this.loadProductos();
        }
      });
    }
    if (this.storage.retrieve('producto')) {
      this.producto = this.storage.retrieve('producto');
      this.storage.observe('producto').subscribe((result) => {
        this.producto = result;
      });
    }
    setTimeout(() => {
      document.getElementById('especification').scrollIntoView({ behavior: 'smooth' })
    }, 500)

  }

  loadProductos() {
    this.api.getProducto(-1, this.categoriaId, -1, true).subscribe(result => {
      if (result.length > 0) {
        this.productos = result;
        this.productos_all = result;
        // this.storage.clear('producto');
      } else {
        this.productos = [];
        this.productos_all = [];
        // this.producto = null;
      }
    });
  }

  loadCategorias() {
    this.api.getCategorias().subscribe(result => {
      this.categorias.push({ id: -1, nombre: 'Todos', descripcion: 'Esta categoría contiene a todos los productos' });
      result.forEach(e => {
        this.categorias.push(e);
      });
      this.categoria = result[0];
      this.rellenarCategorias();
    });
  }

  rellenarCategorias() {
    this.categorias4 = [];
    this.categorias.forEach((e, i) => {
      if (i < this.position && i >= (this.position - 4)) {
        this.categorias4.push(e);
      }
    })
  }

  cambiarCategoria(id: number) {
    this.categoriaId = id;
    this.storage.store('categoria', this.categorias.filter(e => e.id == id)[0])
    this.loadProductos();
    this.storage.clear('producto')
  }

  cargaInicial() {
    let scroll = document.getElementById('scroll');
    scroll.addEventListener("scroll", () => {
      this.cargaInicial2();
    });
  }

  cargaInicial2() {
    let scroll = document.getElementById('scroll');
    let animados = document.querySelectorAll('.animado');
    for (let i = 0; i < animados.length; i++) {
      let animado = <HTMLElement>animados[i]
      if (animado.offsetTop - 600 < scroll.scrollTop) {
        animado.classList.add('activoitem');
        // console.log('scroll ', scroll.scrollTop,' animado ' , animado.offsetTop)
      }
    }
  }

  swicthEspecification(sss, especification: HTMLElement) {
    especification.scrollIntoView({ behavior: "smooth" });
    this.productos = this.productos_all.filter(e => e.id != this.storage.retrieve('producto').id)
    //   try {
    //     if (this.storage.retrieve('producto')) {
    //       this.producto = this.storage.retrieve('producto');
    //       this.api.getCategoriaById(this.producto.categoria).subscribe((result) => {
    //         this.ca = result.nombre;
    //       })
    //       if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
    //         this.id = '0' + this.producto.id;
    //       } else this.id = this.producto.id.toString();
    //     }
    //     this.loadPosts();
    //   } catch (e) {
    //     console.log(e);
    //   }
  }

  abrirComentarios() {
    document.getElementById('posts').classList.toggle('active');
  }
}
