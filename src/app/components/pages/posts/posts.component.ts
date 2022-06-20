import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalRespuestaComponent } from 'src/app/modals/modal-respuesta/modal-respuesta.component';
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
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
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
    ]),]
})
export class PostsComponent implements OnInit {

  alias: string = '';
  correo: string = '';
  calificacion: number = 0;
  comentario: string = '';

  comentar: boolean = false;

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

  posts: any[] = [];
  post_complete: any[] = [];

  filtro: string = '';

  @Output() emisor: EventEmitter<any> = new EventEmitter();



  constructor(private api: ApiService,
    public storage: SessionStorageService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    if (this.storage.retrieve('usuario')) {
      let user = this.storage.retrieve('usuario');
      this.alias = user.usuario;
      this.correo = user.correo;
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
    this.loadPosts();
    if (this.storage.retrieve('producto')) {
      this.producto = this.storage.retrieve('producto');
    }
    this.storage.observe('producto').subscribe((result) => {
      if (result != undefined && result != null) {
        this.producto = result;
        this.loadPosts();
      }
    })
  }

  loadPosts() {
    this.api.getPosts(this.producto.id).subscribe((result) => {
      if (result.length > 0) {
        this.convertirPost(result)
      } else {
        this.posts = [];
        this.post_complete = [];
      }
    })
  }

  filtrar() {
    this.posts = this.post_complete.filter((item) => item.alias.includes(this.filtro));
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
    this.correo = '';
    formData.append('id_producto', this.producto.id.toString());
    this.api.addPosts(formData).subscribe((result) => {
      this.loadPosts();
      this.comentar = !this.comentar;
    }, (error) => {
      console.log(error);
    })
  }

  convertirPost(post_before: Posts[]) {
    this.posts = [];
    this.post_complete = [];
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
        this.post_complete.push({
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

  responderComentario(item) {
    let modal = this.modalService.open(ModalRespuestaComponent, { size: 'sm' });
    modal.componentInstance.id_post = item.id;
    modal.result.then((result) => {
      if (result) {
        this.loadPosts();
      }
    })
  }
}
