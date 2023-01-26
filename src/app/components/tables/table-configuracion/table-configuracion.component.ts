import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalConfiguracionComponent } from 'src/app/modals/modal-configuracion/modal-configuracion.component';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { Configuracion } from 'src/app/models/configuracion';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table-configuracion',
  templateUrl: './table-configuracion.component.html',
  styleUrls: ['./table-configuracion.component.css'],
})
export class TableConfiguracion implements OnInit {
  @Input() configuraciones: Configuracion[] = [];
  loading: boolean = false;
  loading_message: string = 'cargando...';

  constructor(private api: ApiService, private modalService: NgbModal, private storage: SessionStorageService, private crud: CrudService) {
    crud.emitter.subscribe((result) => {
      if (result == 'loadconfig' || result == 'loadall') this.loadConfiguraciones();
    });
  }

  ngOnInit(): void {
    this.loadConfiguraciones();
  }

  loadConfiguraciones() {
    this.loading = true;
    this.api.getConfiguraciones().subscribe((result) => {
      if (result.length > 0) {
        this.configuraciones = result;
      } else this.configuraciones = [];
      this.loading = this.configuraciones.length == 0 ? true : false;
      this.loading_message = this.configuraciones.length == 0 ? 'no hay configuraciones registradas' : ''
    });
  }

  updateConfiguracion(configuracion) {
    let modal = this.modalService.open(ModalConfiguracionComponent, { size: 'md' });
    modal.componentInstance.modalHeader = 'Configuracion';
    modal.componentInstance.modalSubHeader = 'configuraciones del sitio web';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.tiempo = true;
    console.log(configuracion);
    modal.componentInstance.configuracion.id = configuracion.id;
    modal.componentInstance.configuracion.nombre = configuracion.nombre;
    modal.componentInstance.configuracion.descripcion = configuracion.descripcion;
    modal.componentInstance.configuracion.config = configuracion.config;

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
