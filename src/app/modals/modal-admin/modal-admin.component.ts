import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Categoria } from 'src/app/models/categoria';
import { Configuracion } from 'src/app/models/configuracion';
import { Desarrollo } from 'src/app/models/desarrollo';
import { Noticia } from 'src/app/models/noticias';
import { Pedido } from 'src/app/models/pedido';
import { Posts } from 'src/app/models/posts';
import { Producto } from 'src/app/models/producto';
import { Quienes } from 'src/app/models/quienes';
import { Scrap } from 'src/app/models/scrap';
import { Usuario } from 'src/app/models/usuario';
import { Ventas } from 'src/app/models/ventas';
import { ApiService } from 'src/app/services/api.service';
import { ModalCategoriaComponent } from '../modal-categoria/modal-categoria.component';
import { ModalDesarrolloComponent } from '../modal-desarrollo/modal-desarrollo.component';
import { ModalLoginOrRegisterComponent } from '../modal-login-or-register/modal-login-or-register.component';
import { ModalNoticiaComponent } from '../modal-noticia/modal-noticia.component';
import { ModalPostsComponent } from '../modal-posts/modal-posts.component';
import { ModalProductoComponent } from '../modal-producto/modal-producto.component';
import { ModalQuienesComponent } from '../modal-quienes/modal-quienes.component';
import { ModalScrapComponent } from '../modal-scrap/modal-scrap.component';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-modal-admin',
  templateUrl: './modal-admin.component.html',
  styleUrls: ['./modal-admin.component.css'],
})
export class ModalAdminComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';

  actiModal: NgbActiveModal;
  productos: boolean = true;
  noticias: boolean = false;
  categorias: boolean = false;
  desarrollos: boolean = false;
  usuarios: boolean = false;
  chat: boolean = false;
  quienes: boolean = false;
  scrap: boolean = false;
  posts: boolean = false;
  pedidos: boolean = false;
  configuracion: boolean = false;
  ventas: boolean = false;

  usuario: Usuario;
  @Output() emisor: EventEmitter<string> = new EventEmitter<string>();
  add_disable: boolean = false;

  activo: string = 'Productos';
  productosarray: Producto[] = [];
  noticiasarray: Noticia[] = [];
  categoriaarray: Categoria[] = [];
  desarrolloarray: Desarrollo[] = [];
  usuariosarray: Usuario[] = [];
  quienesarray: Quienes[] = [];
  scraparray: Scrap[] = [];
  postsarray: Posts[] = [];
  pedidosarray: Pedido[] = [];
  ventasarray: any[] = [];
  configuracionesarray: Configuracion[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private api: ApiService,
    private modalService: NgbModal,
    private storage: SessionStorageService
  ) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.usuario = this.storage.retrieve('usuario');
  }

  cambiarTabla(event) {
    // console.log(event.target.innerText);
    this.cambiarFalseAll();
    console.log(event.target.innerText);
    
    switch (event.target.innerText) {
      case ' Productos':
        this.productos = true;
        break;
      case ' Noticias':
        this.noticias = true;
        break;
      case ' Categorias':
        this.categorias = true;
        break;
      case ' Desarrollos':
        this.desarrollos = true;
        break;
      case ' Usuarios':
        this.usuarios = true;
        break;
      case ' Chat':
        this.chat = true;
        break;
      case ' Quienes':
        this.quienes = true;
        break;
      case ' Scraps':
        this.scrap = true;
        break;
      case ' Posts':
        this.posts = true;
        break;
      case ' Pedidos':
        this.pedidos = true;
        break;
      case ' Configuracion':
        this.configuracion = true;
        break;
      case ' Ventas':
        this.ventas = true;
        break;
    }
    this.activo = event.target.innerText.toString().substring(1,event.target.innerText.toString().length);
  }

  cambiarFalseAll() {
    this.productos = false;
    this.categorias = false;
    this.noticias = false;
    this.desarrollos = false;
    this.usuarios = false;
    this.chat = false;
    this.quienes = false;
    this.scrap = false
    this.posts = false;
    this.pedidos = false;
    this.ventas = false;
    this.configuracion = false;
  }

  agregar() {
    var modal = undefined;
    switch (this.activo) {
      case 'Productos':
        modal = this.modalService.open(ModalProductoComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Producto';
        modal.componentInstance.modalSubHeader =
          'para la comercializacion y venta';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Noticias':
        modal = this.modalService.open(ModalNoticiaComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Noticia';
        modal.componentInstance.modalSubHeader = 'lo mas reciente en el ICEM';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Categorias':
        modal = this.modalService.open(ModalCategoriaComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Categoria';
        modal.componentInstance.modalSubHeader =
          'tipos de productos de la empresa';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Desarrollos':
        modal = this.modalService.open(ModalDesarrolloComponent, {
          size: 'lg',
        });
        modal.componentInstance.modalHeader = 'Desarrollo';
        modal.componentInstance.modalSubHeader =
          'en pruebas para su posterior venta';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Usuarios':
        modal = this.modalService.open(ModalUsuarioComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Usuario';
        modal.componentInstance.modalSubHeader = 'Administrador de la pagina';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Quienes':
        modal = this.modalService.open(ModalQuienesComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Quienes';
        modal.componentInstance.modalSubHeader = 'Personas integrantes del equipo';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Scraps':
        modal = this.modalService.open(ModalScrapComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Scraps';
        modal.componentInstance.modalSubHeader = 'Scraps de los sitios';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Posts':
        modal = this.modalService.open(ModalPostsComponent, { size: 'lg', backdrop: 'static' });
        modal.componentInstance.modalHeader = 'Posts';
        modal.componentInstance.modalSubHeader = 'Comentarios de las personas';
        modal.result.then((result) => {
          if (result) {
            this.loadAll();
          }
        });
        break;
      case 'Pedidos':
        // modal = this.modalService.open(ModalPostsComponent, { size: 'lg', backdrop: 'static' });
        // modal.componentInstance.modalHeader = 'Posts';
        // modal.componentInstance.modalSubHeader = 'Comentarios de las personas';
        // modal.result.then((result) => {
        //   if (result) {
        //     this.loadPosts();
        //   }
        // });
        break;
    }
  }

  getProductoFoto(id: number, position: number) {
    this.api.getProductoFoto(id).subscribe(result => {
      this.ventasarray[position].url = result.url;
    }, error => {
      this.ventasarray[position].url = error.url;
    })
  }

  loadAll(){
    this.loadCategorias();
    this.loadDesarrollo();
    this.loadNoticia();
    this.loadPedidos();
    this.loadPosts();
    this.loadProductos();
    this.loadQuienes();
    this.loadScraps();
    this.loadUsuario();
    this.loadVentas();
  }

  logout() {
    this.api.logout(this.storage.retrieve('usuario').id).subscribe((res) => {
      this.storage.clear('usuario');
      this.actiModal.close(true);
    })
  }

  loadProductos() {
    this.api.getProducto().subscribe((result) => {
      if (result.length > 0) this.productosarray = result;
      else this.productosarray = [];
    });
  }

  loadNoticia() {
    this.api.getNoticias().subscribe((result) => {
      if (result.length > 0) this.noticiasarray = result;
      else this.noticiasarray = [];
    });
  }

  loadCategorias() {
    this.api.getCategorias().subscribe((result) => {
      if (result.length > 0) this.categoriaarray = result;
      else this.categoriaarray = [];
    });
  }

  loadDesarrollo() {
    this.api.getDesarrollos().subscribe((result) => {
      if (result.length > 0) this.desarrolloarray = result;
      else this.desarrolloarray = [];
    });
  }

  loadUsuario() {
    this.api.getUsuarios().subscribe((result) => {
      if (result.length > 0) {
        if (this.storage.retrieve('usuario').usuario != 'kuroko') {
          this.usuariosarray = result.filter((item) => item != result[0]);
        } else
          this.usuariosarray = result;
      } else this.usuariosarray = [];
    });
  }

  loadQuienes() {
    this.api.getQuienes().subscribe((result) => {
      if (result.length > 0) {
        this.quienesarray = result;
      } else this.quienesarray = [];
    });
  }

  loadScraps() {
    this.api.getScraps().subscribe((result) => {
      if (result.length > 0) {
        this.scraparray = result;
      } else this.scraparray = [];
    });
  }

  loadPosts() {
    this.api.getPosts().subscribe((result) => {
      if (result.length > 0) {
        this.postsarray = result;
      } else this.postsarray = [];
    });
  }

  loadPedidos() {
    this.api.getPedidos().subscribe((result) => {
      if (result.length > 0) {
        this.pedidosarray = result;
      } else this.pedidosarray = [];
    });
  }

  loadVentas() {
    this.ventasarray = [];
    this.api.getVentas().subscribe((result) => {
      if (result.length > 0) {
        result.forEach((e, i) => {
          this.getProductoFoto(e.producto_id, i);
        })
      } else this.ventasarray = [];
    });
  }
}
