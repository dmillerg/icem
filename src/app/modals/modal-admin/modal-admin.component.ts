import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';
import { ModalCategoriaComponent } from '../modal-categoria/modal-categoria.component';
import { ModalDesarrolloComponent } from '../modal-desarrollo/modal-desarrollo.component';
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
  animations: [listAnimation, scaleAnimation]
})
export class ModalAdminComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';

  buttons: any[] = [
    {
      titulo: 'Productos',
      icono: 'bi-bicycle',
      pista: '',
      activo: true,
    },
    {
      titulo: 'Noticias',
      icono: 'bi-newspaper',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Categorías',
      icono: 'bi-bookmark',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Desarrollos',
      icono: 'bi-graph-up',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Usuarios',
      icono: 'bi-person',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Mensajería',
      icono: 'bi-chat-square-dots',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Quienes',
      icono: 'bi-people',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Recogida',
      icono: 'bi-bar-chart-steps',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Comentarios',
      icono: 'bi-file-earmark-text',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Pedidos',
      icono: 'bi-cart',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Configuración',
      icono: 'bi-gear',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Ventas',
      icono: 'bi-receipt',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Preguntas',
      icono: 'bi-question-square',
      pista: '',
      activo: false,
    },
    {
      titulo: 'Cerrar Sesión',
      icono: 'bi-door-closed',
      pista: '',
      activo: false,
    },
  ]

  actiModal: NgbActiveModal;

  usuario: Usuario;
  @Output() emisor: EventEmitter<string> = new EventEmitter<string>();
  add_disable: boolean = false;

  activo: string = this.buttons[0].titulo;

  constructor(
    private activeModal: NgbActiveModal,
    private api: ApiService,
    private modalService: NgbModal,
    private storage: SessionStorageService,
    public crud: CrudService,
  ) {
    crud.emitter.subscribe(result=>{
      if(result?.tipo=='notiposts') console.log(result.cant);
      
    })
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.usuario = this.storage.retrieve('usuario');
    this.loadPosts();
    this.loadPreguntas();
  }

  cambiarTabla(titulo: string = '', i: number = -1) {
    if (titulo == 'Cerrar Sesión') {
      this.logout();
    } else {
      this.buttons.forEach(e => {
        e.activo = false;
      })
      this.buttons[i].activo = true;
      this.activo = titulo;
    }
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
            this.crud.loadEvento('all');
          }
        });
        break;
      case 'Noticias':
        modal = this.modalService.open(ModalNoticiaComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Noticia';
        modal.componentInstance.modalSubHeader = 'lo mas reciente en el ICEM';
        modal.result.then((result) => {
          if (result) {
            this.crud.loadEvento('all');
          }
        });
        break;
      case 'Categorías':
        modal = this.modalService.open(ModalCategoriaComponent, { size: 'md' });
        modal.componentInstance.modalHeader = 'Categoria';
        modal.componentInstance.modalSubHeader =
          'tipos de productos de la empresa';
        modal.result.then((result) => {
          if (result) {
            this.crud.loadEvento('all');
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
            this.crud.loadEvento('all');
          }
        });
        break;
      case 'Usuarios':
        modal = this.modalService.open(ModalUsuarioComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Usuario';
        modal.componentInstance.modalSubHeader = 'Administrador de la pagina';
        modal.result.then((result) => {
          if (result) {
            this.crud.loadEvento('all');
          }
        });
        break;
      case 'Quienes':
        modal = this.modalService.open(ModalQuienesComponent, { size: 'md' });
        modal.componentInstance.modalHeader = 'Quienes';
        modal.componentInstance.modalSubHeader = 'Personas integrantes del equipo';
        modal.result.then((result) => {
          if (result) {
            this.crud.loadEvento('all');
          }
        });
        break;
      case 'Recogida':
        modal = this.modalService.open(ModalScrapComponent, { size: 'lg' });
        modal.componentInstance.modalHeader = 'Scraps';
        modal.componentInstance.modalSubHeader = 'Scraps de los sitios';
        modal.result.then((result) => {
          if (result) {
            this.crud.loadEvento('all');
          }
        });
        break;
      case 'Comentarios':
        modal = this.modalService.open(ModalPostsComponent, { size: 'md', backdrop: 'static' });
        modal.componentInstance.modalHeader = 'Posts';
        modal.componentInstance.modalSubHeader = 'Comentarios de las personas';
        modal.result.then((result) => {
          if (result) {
            this.crud.loadEvento('all');
          }
        });
        break;
      case 'Pedidos':
        break;
    }
  }

  logout() {
    this.api.logout(this.storage.retrieve('usuario').id).subscribe((res) => {
      this.storage.clear('usuario');
      this.actiModal.close(true);
    })
  }

  loadPosts(){
    this.api.getPosts().subscribe(result=>{
      const cant = result.filter(r=>r.cant_resp==0).length;
      this.buttons.filter(e=>e.titulo=='Comentarios')[0].cant = cant;
    });
  }

  loadPreguntas(){
    this.api.getMensajes().subscribe(result=>{
      const cant = result.filter(r=>r.visto).length;
      this.buttons.filter(e=>e.titulo=='Preguntas')[0].cant = cant;
    });
  }
}
