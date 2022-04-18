import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css'],
})
export class ModalDeleteComponent implements OnInit {
  modalHeader: string = '';
  modalId: number = -1;
  actiModal: NgbActiveModal;

  constructor(private api: ApiService, private activeModal: NgbActiveModal) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void { }

  delete() {
    switch (this.modalHeader) {
      case 'Productos':
        this.api.deleteProducto(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
      case 'Categorias':
        this.api.deleteCategoria(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
      case 'Noticias':
        this.api.deleteNoticia(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
      case 'Desarrollos':
        this.api.deleteDesarrollo(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
      case 'Usuarios':
        this.api.deleteUsuarios(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
      case 'Quienes':
        this.api.deleteQuienes(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
      case 'Posts':
        this.api.deletePosts(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
        case 'Pedido':
        this.api.deletePedido(this.modalId).subscribe(
          (result) => {
            this.devolverResult(true, result.toString());
          },
          (err) => this.devolverResult(false, err)
        );
        break;
      default:
        break;
    }
  }

  devolverResult(resp: boolean, error: string) {
    this.actiModal.close({ resp: resp, error: error });
  }
}
