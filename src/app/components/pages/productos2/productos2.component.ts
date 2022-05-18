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

@Component({
  selector: 'app-productos2',
  templateUrl: './productos2.component.html',
  styleUrls: ['./productos2.component.css'],
  animations: [listAnimation]
})
export class Productos2Component implements OnInit {


  productos: Producto[] = [];
  categorias: Categoria[] = []; 
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
  categoria: Categoria = {
    id: -1,
    nombre: ''
  };

  alias: string = '';
  correo: string = '';
  comentario: string = '';
  comentarios: boolean = false;

  categoriaId: number = -1;

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
          this.loadProductos();
        }
      })
    }
  }

  loadProductos() {
    this.api.getProducto(-1, this.categoriaId, -1).subscribe(result => {
      if (result.length > 0) {
        this.productos = result;
        this.producto = result[0]
      } else {
        this.productos = [];
        this.producto = null;
      }
    });
  }

  loadCategorias() {
    this.api.getCategorias().subscribe(result => {
      this.categorias.push({ id: -1, nombre: 'Todos' });
      result.forEach(e => {
        this.categorias.push(e);
      });
      this.categoria = result[0];
    });
  }

  cambiarCategoria(id: number) {
    this.categoriaId = id;
    this.storage.store('categoria', this.categorias.filter(e => e.id == id)[0])
    this.loadProductos();
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
