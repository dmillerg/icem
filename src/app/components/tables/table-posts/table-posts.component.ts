import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalPostsComponent } from 'src/app/modals/modal-posts/modal-posts.component';
import { ModalRespuestaComponent } from 'src/app/modals/modal-respuesta/modal-respuesta.component';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table-posts',
  templateUrl: './table-posts.component.html',
  styleUrls: ['./table-posts.component.css'],
})
export class TablePostsComponent implements OnInit {
  @Input() posts: Posts[];
  correo_query: string = '';
  usuario_query: string = '';
  visto_query: number = -1;
  loading: boolean = false;
  loading_message: string = 'cargando...';

  constructor(private api: ApiService, private modalService: NgbModal, private crud: CrudService) {
    crud.emitter.subscribe(result => {
      if (result == 'loadposts' || result == 'loadall') {
        this.loadPosts();
      }
    })
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.api.getPosts().subscribe((result) => {
      if (result.length > 0) this.posts = result;
      else this.posts = [];
      const noti = this.posts.filter(r => r.cant_resp == 0).length;
      if (noti > 0) {
        this.crud.notificacion('posts', noti);
      }
      this.loading = this.posts.length == 0 ? true : false;
      this.loading_message = this.posts.length == 0 ? 'no hay comentarios registrados' : ''
    });
  }

  updatePosts(posts) {
    let modal = this.modalService.open(ModalPostsComponent, { size: 'md' });
    modal.componentInstance.modalHeader = 'Posts';
    modal.componentInstance.modalSubHeader = 'comentarios que hacen los usuarios';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.posts = posts;
    modal.result.then((result) => {
      if (result) {
        this.loadPosts();
      }
    });
  }

  delete(posts: Posts) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = posts.id;
    modal.componentInstance.modalHeader = 'Posts';
    modal.result.then((result) => {
      if (result) {
        this.loadPosts();
      }
    });
  }

  responderPost(posts: Posts) {
    let modal = this.modalService.open(ModalRespuestaComponent, { size: 'md' });
    modal.componentInstance.id_post = posts.id;
    modal.componentInstance.modalHeader = 'Responder';
    modal.result.then((result) => {
      if (result) {
        this.loadPosts();
      }
    });
  }


}
