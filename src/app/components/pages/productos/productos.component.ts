import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { post } from 'jquery';
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
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(-50%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productoss: Producto[] = [];
  categorias: Categoria[] = [];

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
    disponibilidad: 0
  };
  id: string = '';
  category: string = '';
  filtro: string = '';

  posts: any[] = [];
  posts_complete: any[] = [];

  alias: string = '';
  correo: string = '';
  comentario: string = '';

  comentar: boolean = false;

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
      }
    } catch (e) {
      console.log(e);
    }
    this.loadCategorias();
    this.loadProductos();
  }

  loadCategorias() {
    this.api.getCategorias().subscribe((result) => {
      this.categorias.push({ id: -1, nombre: 'Todos' });
      result.forEach(item => this.categorias.push(item));
      this.anterior = this.categorias[0].nombre;
    });
  }

  loadPosts() {
    this.api.getPosts(this.producto.id).subscribe((result) => {
      if (result.length > 0) {
        this.convertirPost(result);
      } else {
        this.posts_complete = [];
        this.posts = [];
      }
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
        this.loadPosts();
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
        if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
          this.id = '0' + this.producto.id;
        } else this.id = this.producto.id.toString();
      }
      this.loadPosts();
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

  abrirComentar() {
    this.comentar = !this.comentar;
  }

  abrirFiltro() {
    if (document.getElementById('form').classList.contains('activo')) {
      document.getElementById('form').classList.remove('activo');
      document.getElementById('input').classList.remove('activo');
      document.getElementById('btn-filter').classList.remove('activo');
    } else {
      document.getElementById('form').classList.add('activo');
      document.getElementById('input').classList.add('activo');
      document.getElementById('btn-filter').classList.add('activo');
    }
  }

  filtrar() {
    this.posts = this.posts_complete.filter((item) => item.alias.includes(this.filtro));
  }

  validarComentario() {
    return this.alias.length > 0 && this.correo.length > 0 && this.comentario.length > 0;
  }

  enviarPosts() {
    let formData: FormData = new FormData();
    formData.append('alias', this.alias);
    formData.append('correo', this.correo);
    formData.append('comentario', this.comentario);
    formData.append('id_producto', this.producto.id.toString());
    this.api.addPosts(formData).subscribe((result) => {
      this.loadPosts();
      this.abrirComentar();
    }, (error) => {
      console.log(error);
    })
  }

  convertirPost(post_before: Posts[]) {
    this.posts = [];
    this.posts_complete = [];
    post_before.forEach((element) => {
      this.api.respuestasByPost(element.id).subscribe((result) => {
        this.posts.push({
          id: element.id,
          alias: element.alias,
          correo: element.correo,
          comentario: element.comentario,
          fecha: element.fecha,
          id_producto: element.id_producto,
          respuestas: result,
        });
        this.posts_complete.push({
          id: element.id,
          alias: element.alias,
          correo: element.correo,
          comentario: element.comentario,
          fecha: element.fecha,
          id_producto: element.id_producto,
          respuestas: result,
        });
      })
    })
  }
}
