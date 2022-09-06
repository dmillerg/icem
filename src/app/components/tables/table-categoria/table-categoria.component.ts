import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCategoriaComponent } from 'src/app/modals/modal-categoria/modal-categoria.component';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { Categoria } from 'src/app/models/categoria';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-categoria',
  templateUrl: './table-categoria.component.html',
  styleUrls: ['./table-categoria.component.css'],
})
export class TableCategoriaComponent implements OnInit {
  @Input() categorias: Categoria[];
  all_query: string = "";
  constructor(private api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias() {
    this.api.getCategorias().subscribe((result) => {
      if (result.length > 0) this.categorias = result;
      else this.categorias = [];
    });
  }

  updateCategoria(categoria) {
    let modal = this.modalService.open(ModalCategoriaComponent, { size: 'md' });
    modal.componentInstance.modalHeader = 'Categoria';
    modal.componentInstance.modalSubHeader = 'tipos de productos de la empresa';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.categoria = categoria;
    modal.result.then((result) => {
      if (result) {
        this.loadCategorias();
      }
    });
  }

  delete(categoria: Categoria) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = categoria.id;
    modal.componentInstance.modalHeader = 'Categorias';
    modal.result.then((result) => {
      if (result) {
        this.loadCategorias();
      }
    });
  }
}
