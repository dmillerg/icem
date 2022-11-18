import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  animations: [listAnimation, scaleAnimation]
})
export class ProductosComponent implements OnInit {


  productos: Producto[] = [];
  productos_all: Producto[] = [];
  categorias: Categoria[] = [];
  categorias4: Categoria[] = [];
  posts: any[] = [];

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
  };
  producto2: any = {
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


  categoriaId: number = -1;
  position: number = 4;

  alias: string = '';
  correo: string = '';
  calificacion: number = 0;
  comentario: string = '';

  positionProductsLeft: number = -1;
  positionProductsRight: number = -1;

  constructor(private api: ApiService,
    public storage: SessionStorageService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargaInicial();
    this.cargaInicial2();
    this.loadCategorias();
    this.cargarCategoriaStorage();
    this.cargarProductoStorage();
    this.cargarUsuarioStorage();
    this.navigateToProduct();
  }

  cargarCategoriaStorage() {
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
  }

  cargarProductoStorage() {
    if (this.storage.retrieve('producto')) {
      setTimeout(() => {
        document.getElementById('especification').scrollIntoView({ behavior: 'smooth' })
      }, 500)
      this.producto = this.storage.retrieve('producto');
      this.storage.observe('producto').subscribe((result) => {
        this.producto = result;
      });
    }
  }

  cargarUsuarioStorage() {
    if (this.storage.retrieve('usuario')) {
      let user = this.storage.retrieve('usuario');
      this.alias = user.usuario;
      this.correo = user.correo;
    }
    this.storage.observe('usuario').subscribe((result) => {
      if (result) {
        this.alias = result.usuario;
        this.correo = result.correo;
      } else {
        this.alias = '';
        this.correo = '';
      }
    })
  }

  loadProductos() {
    this.api.getProducto(-1, this.categoriaId, -1, true).subscribe(result => {
      if (result.length > 0) {
        this.productos = result;
        this.productos_all = result;
        if (this.storage.retrieve('producto')) {
          this.productos = this.productos_all.filter(e => e.id != this.storage.retrieve('producto').id)
        }
        this.positionProductsLeft = 4;
        this.positionProductsRight = 0;
        this.navigateToProduct()
      } else {
        this.productos = [];
        this.productos_all = [];
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
      this.loadProductos();
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
      }
    }
  }

  swicthEspecification(sss, especification: HTMLElement) {
    especification.scrollIntoView({ behavior: "smooth" });
    this.productos = this.productos_all.filter(e => e.id != this.storage.retrieve('producto').id)
  }

  abrirComentarios() {
    document.getElementById('posts').classList.toggle('active');
  }

  calificar(event) {
    this.calificacion = event
  }

  validarComentario() {
    return this.alias.length > 0 && this.correo.length > 0 && this.comentario.length > 0;
  }

  enviarPosts() {
    let formData: FormData = new FormData();
    formData.append('alias', this.alias);
    formData.append('correo', this.correo);
    formData.append('calificacion', this.calificacion.toString());
    formData.append('comentario', this.comentario);
    formData.append('id_producto', this.producto.id.toString());
    this.api.addPosts(formData).subscribe((result) => {
      this.comentario = ''
      this.calificacion = 0;
      this.storage.store('producto', this.producto)
    }, (error) => {
      console.log(error);
    })
  }

  scrollPrevNext(action: string) {
    if (action == 'next') {
      let p = this.positionProductsLeft + 1;
      this.positionProductsLeft = (p < this.productos.length) ? p : this.positionProductsLeft;
      this.positionProductsRight = p < this.productos.length ? this.positionProductsRight + 1 : this.positionProductsRight;
      document.getElementById(this.positionProductsLeft.toString() + 'scroll').scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    } else {
      let p = this.positionProductsRight - 1;
      this.positionProductsRight = (p >= 0) ? p : this.positionProductsRight;
      this.positionProductsLeft = p >= 0 ? this.positionProductsLeft - 1 : this.positionProductsLeft;
      document.getElementById(this.positionProductsRight.toString() + 'scroll').scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  navigateToProduct() {
    this.activatedRoute.queryParams.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.storage.store('categoria', { id: -1, nombre: 'Todos' })
        console.log('idd =>', id);
        const p = this.productos_all.filter(e => e.id == id)[0];
        this.storage.store('producto', p)
        if (p) this.producto = p;
        setTimeout(() => {
          document.getElementById('especification').scrollIntoView({ behavior: 'smooth' })
        }, 500)
      }
    });
  }
}
