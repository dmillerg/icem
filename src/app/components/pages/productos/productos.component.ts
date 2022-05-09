import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { post } from 'jquery';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalRespuestaComponent } from 'src/app/modals/modal-respuesta/modal-respuesta.component';
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
export class ProductosComponent implements OnInit, OnDestroy {
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
    categoria: -1,
    disponibilidad: 0,
    especificaciones: '',
    garantia: '',
    ficha: '',
    imagen: '',
    precio: 0,
    usos: ''
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
  categoriaId: number = -1;

  constructor(
    private api: ApiService,
    private storage: SessionStorageService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnDestroy(): void {
    this.storage.store('categoria', {id: -1, nombre: 'Todos'});
  }

  ngOnInit(): void {
    this.cargaInicial();
    this.cargaInicial2();
    this.loadUsuario();
    if (this.storage.retrieve('producto')) {
      this.producto = this.storage.retrieve('producto');
      this.producto_especificacion = true;
      this.changeCategory(this.producto.categoria);
      if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
        this.id = '0' + this.producto.id;
      } else this.id = this.producto.id.toString();
    }
    this.loadAllProductos();
    this.loadCategorias();
    this.loadProductos();
    this.observeCategoria();
  }

  loadUsuario() {
    if (this.storage.retrieve('usuario')) {
      this.correo = this.storage.retrieve('usuario').correo;
      this.alias = this.storage.retrieve('usuario').usuario;
    }
    this.storage.observe('usuario').subscribe((result) => {
      if (result) {
        this.correo = result.correo;
        this.alias = result.usuario;
      } else {
        this.correo = '';
        this.alias = '';
      }
    })
  }

  loadAllProductos() {
    this.api.getProducto(0, -1, -1).subscribe((result) => {
      this.productoss = result;
    })
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

  observeCategoria() {
    if (this.storage.retrieve('categoria')) {
      this.categoriaId = this.storage.retrieve('categoria').id;
    }
    this.storage.observe('categoria').subscribe((result) => {
      if (result) {
        this.categoriaId = result.id;
        this.loadProductos();
      }
    })
  }

  loadProductos() {
    this.api.getProducto(0, this.categoriaId, this.producto.id).subscribe((result) => {
      this.productos = result;
      this.loadPosts();
      if (this.storage.retrieve('producto')) {
        this.storage.store('producto', this.producto);
      }
      if (!this.producto_especificacion) {
        this.producto = this.productos[0];
        this.changeCategory(this.producto.categoria);
        // this.productos = this.productoss.filter(item => item.id != this.productoss[0].id);
        if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
          this.id = '0' + this.producto.id;
        } else { this.id = this.producto.id.toString(); }

      }
    });
  }

  changeCategory(id) {
    this.api.getCategoriaById(id).subscribe((result) => {
      this.category = result.nombre;
    });
  }

  openResponder(item: any) {
    let modal = this.modalService.open(ModalRespuestaComponent);
    modal.componentInstance.id_post = item.id;
    modal.componentInstance.modalHeader = 'Responder';
    modal.result.then((result) => {
      if (result) {
        this.loadPosts();
      }
    });
  }

  swichtProductos(item, cat) {
    console.log(item, cat);
    this.storage.store('categoria', cat);
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

  abrirComentarios() {
    this.comentarios = !this.comentarios;
  }

  abrirComentar() {
    this.comentar = !this.comentar;
  }

  abrirFiltro() {
    document.getElementById('form').classList.toggle('activo');
    document.getElementById('input').classList.toggle('activo');
    document.getElementById('btn-filter').classList.toggle('activo');
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
