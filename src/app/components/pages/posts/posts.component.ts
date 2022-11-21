import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { ModalRespuestaComponent } from 'src/app/modals/modal-respuesta/modal-respuesta.component';
import { Posts } from 'src/app/models/posts';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  animations: [listAnimation, scaleAnimation]
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

  @Input() posts: any[] = [];
  post_complete: any[] = [];

  filtro: string = '';

  @Output() emisor: EventEmitter<any> = new EventEmitter();



  constructor(private api: ApiService,
    public storage: SessionStorageService,
    private modalService: NgbModal,
    private crud: CrudService) {
      crud.emitter.subscribe(()=>{
        this.loadPosts()
      })
  }

  ngOnInit(): void {
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

    if (this.storage.retrieve('producto')) {
      this.producto = this.storage.retrieve('producto');
      this.loadPosts();
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
        console.log(result);

      } else {
        this.posts = [];
        this.post_complete = [];
      }
    });
  }

  filtrar() {
    this.posts = this.post_complete.filter((item) => item.alias.includes(this.filtro));
  }

  validarComentario() {
    return this.alias.length > 0 && this.correo.length > 0 && this.comentario.length > 0;
  }

  enviarPosts() {
    let formData: FormData = new FormData();
    console.log(this.calificacion);
    formData.append('alias', this.alias);
    formData.append('correo', this.correo);
    formData.append('calificacion', this.calificacion.toString());
    formData.append('comentario', this.comentario);
    formData.append('id_producto', this.producto.id.toString());
    this.api.addPosts(formData).subscribe((result) => {
      this.loadPosts();
      this.comentar = !this.comentar;
      this.comentario = ''
      this.calificacion = 0;
      // this.emisor.emit(true);
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
          calificacion: element.calificacion,
          fecha: element.fecha,
          id_producto: element.id_producto,
          respuestas: result,
        });
        this.post_complete.push({
          id: element.id,
          alias: element.alias,
          correo: element.correo,
          comentario: element.comentario,
          calificacion: element.calificacion,
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

  calificar(event) {
    this.calificacion = event
  }
}
