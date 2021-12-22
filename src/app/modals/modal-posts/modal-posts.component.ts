import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';

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
  };

  posts_pasado: Posts = {
    id: -1,
    alias: '',
    correo: '',
    comentario: '',
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
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
    formData.append('comentario', this.posts.comentario.toString());

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
