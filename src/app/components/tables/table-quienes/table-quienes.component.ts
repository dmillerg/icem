import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { ModalQuienesComponent } from 'src/app/modals/modal-quienes/modal-quienes.component';
import { Producto } from 'src/app/models/producto';
import { Quienes } from 'src/app/models/quienes';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table-quienes',
  templateUrl: './table-quienes.component.html',
  styleUrls: ['./table-quienes.component.css'],
})
export class TableQuienesComponent implements OnInit {
  @Input() quienes: Quienes[];
  loading: boolean = false;
  loading_message: string = 'cargando...';

  constructor(private api: ApiService, private modalService: NgbModal, private crud: CrudService) {
    crud.emitter.subscribe(result => {
      if (result == 'loadquienes' || result == 'loadall') {
        this.loadQuienes();
      }
    })
  }

  ngOnInit(): void {
    this.loadQuienes();
  }

  loadQuienes() {
    this.loading = true;
    this.api.getQuienes().subscribe((result) => {
      if (result.length > 0) this.quienes = result;
      else this.quienes = [];
      this.loading = this.quienes.length == 0 ? true : false;
      this.loading_message = this.quienes.length == 0 ? 'no hay quienes registrados' : ''
    });
  }

  updateQuienes(quien) {
    let modal = this.modalService.open(ModalQuienesComponent, { size: 'md' });
    modal.componentInstance.modalHeader = 'Quienes';
    modal.componentInstance.modalSubHeader = 'para la comercializacion y venta';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.quien = quien;
    modal.result.then((result) => {
      if (result) {
        this.loadQuienes();
      }
    });
  }

  delete(quienes: Quienes) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = quienes.id;
    modal.componentInstance.modalHeader = 'Quienes';
    modal.result.then((result) => {
      if (result) {
        this.loadQuienes();
      }
    });
  }
}
