import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalPostsComponent } from 'src/app/modals/modal-posts/modal-posts.component';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-posts',
  templateUrl: './table-posts.component.html',
  styleUrls: ['./table-posts.component.css'],
})
export class TablePostsComponent implements OnInit {
  @Input() posts: Posts[];
  constructor(private api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.api.getPosts().subscribe((result) => {
      if (result.length > 0) this.posts = result;
      else this.posts = [];
    });
  }

  updatePosts(posts) {
    let modal = this.modalService.open(ModalPostsComponent, { size: 'lg' });
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
}
