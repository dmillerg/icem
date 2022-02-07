import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Respuesta } from 'src/app/models/respuesta';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-respuesta',
  templateUrl: './modal-respuesta.component.html',
  styleUrls: ['./modal-respuesta.component.css'],
})
export class ModalRespuestaComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;
  id_post: number = -1;

  alias: string = '';
  correo: string = '';
  comentario: string = '';

  respuesta: Respuesta = {
    id: -1,
    respuesta: '',
    fecha: '',
    id_post: -1,
  };

  respuesta_pasado: Respuesta = {
    id: -1,
    respuesta: '',
    fecha: '',
    id_post: -1,
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
    if (this.id_post > -1) {
      this.cargarPosts();
    }
  }

  cargarPosts() {
    this.api.getPostsByID(this.id_post).subscribe((result) => {
      this.alias = result.alias;
      this.correo = result.correo;
      this.comentario = result.comentario;
    })
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.respuesta_pasado.id = this.respuesta.id;
      this.respuesta_pasado.respuesta = this.respuesta.respuesta;
      this.respuesta_pasado.fecha = this.respuesta.fecha;
      this.respuesta_pasado.id_post = this.respuesta.id_post;
    }
  }

  addUpdateRespuesta() {
    let formData = new FormData();
    formData.append('id', this.respuesta.id.toString());
    formData.append('respuesta', this.respuesta.respuesta.toString());
    formData.append('fecha', this.respuesta.fecha.toString());
    formData.append('id_post', this.id_post.toString());

    if (this.modalAction == 'Editar') {
      // this.api.updatePosts(formData, this.posts.id).subscribe(
      //   (result) => {
      //     this.actiModal.close('Posts');
      //     console.log(result);
      //   },
      //   (error) => {
      //     this.actiModal.close('Posts');
      //     console.log(error);
      //   }
      // );
    } else {
      this.api.addRespuesta(formData).subscribe(
        (result) => {
          this.actiModal.close('Respuesta');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Respuesta');
          console.log(error);
        }
      );
    }
  }
}
