import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { ModalQuienesComponent } from 'src/app/modals/modal-quienes/modal-quienes.component';
import { Producto } from 'src/app/models/producto';
import { Quienes } from 'src/app/models/quienes';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-quienes',
  templateUrl: './table-quienes.component.html',
  styleUrls: ['./table-quienes.component.css'],
})
export class TableQuienesComponent implements OnInit {
  @Input() quienes: Quienes[];
  constructor(private api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadQuienes();
  }

  loadQuienes() {
    this.api.getQuienes().subscribe((result) => {
      if (result.length > 0) this.quienes = result;
      else this.quienes = [];
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
