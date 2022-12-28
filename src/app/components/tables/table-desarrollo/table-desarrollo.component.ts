import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalDesarrolloComponent } from 'src/app/modals/modal-desarrollo/modal-desarrollo.component';
import { Desarrollo } from 'src/app/models/desarrollo';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table-desarrollo',
  templateUrl: './table-desarrollo.component.html',
  styleUrls: ['./table-desarrollo.component.css'],
})
export class TableDesarrolloComponent implements OnInit {
  @Input() desarrollos: Desarrollo[];
  titulo_query: string = '';
  fecha_query: string = '';
  fechas: any[] = [];
  all_query: string = '';
  loading: boolean = false;
  constructor(private api: ApiService, private modalService: NgbModal, private crud: CrudService) {
    crud.emitter.subscribe(result => {
      if (result == 'loaddesarrollos' || result == 'loadall') this.loadDesarrollo();
    })
  }

  ngOnInit(): void {
    this.loadDesarrollo();
  }

  loadDesarrollo() {
    this.loading = true;
    this.api.getDesarrollos().subscribe((result) => {
      if (result.length > 0) this.desarrollos = result;
      else this.desarrollos = [];
      this.desarrollos.forEach(item => {
        if (this.fechas.indexOf(item.fecha) == -1) this.fechas.push(item.fecha);
      });
      this.loading = false;
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
