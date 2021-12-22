import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Categoria } from 'src/app/models/categoria';
import { Posts } from 'src/app/models/posts';
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
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  animations: [listAnimation,
    trigger('scaleAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-50%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productoss: Producto[] = [];
  categorias: Categoria[] = [];
  posts: Posts[] = [];
  anterior: string = '';
  comentarios: boolean = false;
  producto_especificacion: boolean = false;
  producto: Producto = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
    categoria: -1,
    usos: '',
    especificaciones: '',
    garantia: '',
    precio: 0,
  };
  id: string = '';
  category: string = '';

  constructor(
    private api: ApiService,
    private storage: SessionStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargaInicial();
    try {
      if (this.storage.retrieve('producto')) {
        this.producto = this.storage.retrieve('producto');
        this.producto_especificacion = true;
        this.changeCategory(this.producto.categoria);
        if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
          this.id = '0' + this.producto.id;
        } else this.id = this.producto.id.toString();
        console.log('entro');
      }
    } catch (e) {
      console.log(e);
    }
    this.loadCategorias();
    this.loadProductos();
    this.loadPosts();
  }

  loadCategorias() {
    this.api.getCategorias().subscribe((result) => {
      this.categorias.push({ id: -1, nombre: 'Todos' });
      result.forEach(item => this.categorias.push(item));
      this.anterior = this.categorias[0].nombre;
    });
  }

  loadPosts() {
    this.api.getPosts().subscribe((result) => {
      this.posts = result;
    })
  }

  loadProductos() {
    this.api.getProducto(0, -1, this.producto.id).subscribe((result) => {
      this.productos = result;
      this.productoss = this.productos;
      if (!this.producto_especificacion) {
        this.producto = this.productos[0];
        this.changeCategory(this.producto.categoria);
        // this.productos = this.productoss.filter(item => item.id != this.productoss[0].id);
        if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
          this.id = '0' + this.producto.id;
        } else this.id = this.producto.id.toString();
      }
    });
  }

  changeCategory(id) {
    this.api.getCategoriaById(id).subscribe((result) => {
      this.category = result.nombre;
    });
  }

  swichtProductos(item, cat) {
    console.log(item, cat);
    this.api.getProducto(0, cat).subscribe((result) => {
      if (cat != -1) {
        this.productos = this.productoss.filter((item) => item.categoria == cat);
      } else {
        this.productos = result;
      }
    });
    document.getElementById(this.anterior).classList.remove('active');
    document.getElementById(item.target.innerText).classList.add('active');
    this.anterior = item.target.innerText;
  }

  swicthEspecification(sss, especification: HTMLElement) {
    especification.scrollIntoView({ behavior: "smooth" });
    try {
      if (this.storage.retrieve('producto')) {
        this.producto = this.storage.retrieve('producto');
        this.api.getCategoriaById(this.producto.categoria).subscribe((result) => {
          this.category = result.nombre;
        })
        this.productos = this.productoss.filter((item) => item.id != this.producto.id);
        if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
          this.id = '0' + this.producto.id;
        } else this.id = this.producto.id.toString();
      }

    } catch (e) {
      console.log(e);
    }
  }

  cargaInicial() {
    let scroll = document.getElementById('scroll');
    let animados = document.querySelectorAll('.animado');
    scroll.addEventListener("scroll", function () {
      for (let i = 0; i < animados.length; i++) {
        let animado = <HTMLElement>animados[i]
        if (animado.offsetTop - 600 < scroll.scrollTop) {
          animado.classList.add('activoitem');
          // console.log('scroll ', scroll.scrollTop,' animado ' , animado.offsetTop)
        }
      }

    });
  }

  abrirComentarios() {
    this.comentarios = !this.comentarios;
  }
}
