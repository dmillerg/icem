import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalDesarrolloComponent } from 'src/app/modals/modal-desarrollo/modal-desarrollo.component';
import { Desarrollo } from 'src/app/models/desarrollo';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-desarrollo',
  templateUrl: './table-desarrollo.component.html',
  styleUrls: ['./table-desarrollo.component.css'],
})
export class TableDesarrolloComponent implements OnInit {
  @Input() desarrollos: Desarrollo[];
  titulo_query: string = '';
  fecha_query: string = '';
  all_query: string = '';
  constructor(private api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadDesarrollo();
  }

  loadDesarrollo() {
    this.api.getDesarrollos().subscribe((result) => {
      if (result.length > 0) this.desarrollos = result;
      else this.desarrollos = [];
    });
  }

  updateDesarrollo(desarrollo) {
    let modal = this.modalService.open(ModalDesarrolloComponent, { size: 'lg' });
    modal.componentInstance.modalHeader = 'Desarrollo';
    modal.componentInstance.modalSubHeader = 'en pruebas para su posterior venta';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.desarrollo = desarrollo;
    modal.result.then((result) => {
      if (result) {
        this.loadDesarrollo();
      }
    });
  }

  delete(desarrollo: Desarrollo) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = desarrollo.id;
    modal.componentInstance.modalHeader = 'Desarrollos';
    modal.result.then((result) => {
      if (result) {
        this.loadDesarrollo();
      }
    });
  }
}
