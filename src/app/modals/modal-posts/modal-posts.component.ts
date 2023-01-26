import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-posts',
  templateUrl: './modal-posts.component.html',
  styleUrls: ['./modal-posts.component.css'],
})
export class ModalPostsComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  posts: Posts = {
    id: -1,
    alias: '',
    correo: '',
    comentario: '',
    fecha: '',
    id_producto: -1,
    cant_resp: 0,
    calificacion: 0,
  };

  url: string = '';

  posts_pasado: Posts = {
    id: -1,
    alias: '',
    correo: '',
    comentario: '',
    fecha: '',
    id_producto: -1,
    cant_resp: 0,
    calificacion: 0,
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
    this.url= environment.url_backend +`pictures/${this.posts.id_producto}?tipo=productos`
  }

  urlChange(){
    this.url= environment.url_backend +`pictures/${this.posts.id_producto}?tipo=productos`
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.posts_pasado.id = this.posts.id;
      this.posts_pasado.alias = this.posts.alias;
      this.posts_pasado.correo = this.posts.correo;
      this.posts_pasado.comentario = this.posts.comentario;
    }
  }

  addUpdatePosts() {
    let formData = new FormData();
    formData.append('id', this.posts.id.toString());
    formData.append('alias', this.posts.alias.toString());
    formData.append('correo', this.posts.correo.toString());
    formData.append('calificacion', this.posts.calificacion.toString());
    formData.append('comentario', this.posts.comentario.toString());
    formData.append('fecha', this.posts.fecha.toString());
    formData.append('id_producto', this.posts.id_producto.toString());

    if (this.modalAction == 'Editar') {
      this.api.updatePosts(formData, this.posts.id).subscribe(
        (result) => {
          this.actiModal.close('Posts');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Posts');
          console.log(error);
        }
      );
    } else {
      this.api.addPosts(formData).subscribe(
        (result) => {
          this.actiModal.close('Posts');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Posts');
          console.log(error);
        }
      );
    }
  }
}
