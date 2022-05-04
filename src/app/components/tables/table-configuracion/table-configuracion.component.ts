import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalConfiguracionComponent } from 'src/app/modals/modal-configuracion/modal-configuracion.component';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { Configuracion } from 'src/app/models/configuracion';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-configuracion',
  templateUrl: './table-configuracion.component.html',
  styleUrls: ['./table-configuracion.component.css'],
})
export class TableConfiguracion implements OnInit {
  @Input() configuraciones: Configuracion[]=[];
  constructor(private api: ApiService, private modalService: NgbModal, private storage: SessionStorageService) { }

  ngOnInit(): void {
    this.loadConfiguraciones();
  }

  loadConfiguraciones() {
    this.api.getConfiguraciones().subscribe((result) => {
      if (result.length > 0) {
          this.configuraciones = result;
      } else this.configuraciones = [];
    });
  }

  updateConfiguracion(configuracion) {
    let modal = this.modalService.open(ModalConfiguracionComponent, { size: 'md' });
    modal.componentInstance.modalHeader = 'Configuracion';
    modal.componentInstance.modalSubHeader = 'configuraciones del sitio web';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.tiempo = true;
    modal.componentInstance.configuracion = configuracion;
    
    modal.result.then((result) => {
      if (result) {
        this.loadConfiguraciones();
      }
    });
  }

  delete(configuracion: Configuracion) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = configuracion.id;
    modal.componentInstance.modalHeader = 'Configuracion';
    modal.result.then((result) => {
      if (result) {
        this.loadConfiguraciones();
      }
    });
  }
}