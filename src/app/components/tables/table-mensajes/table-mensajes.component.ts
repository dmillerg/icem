import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalMensajeComponent } from 'src/app/modals/modal-mensaje/modal-mensaje.component';
import { Mensaje } from 'src/app/models/mensaje';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table-mensajes',
  templateUrl: './table-mensajes.component.html',
  styleUrls: ['./table-mensajes.component.css'],
})
export class TableMensajesComponent implements OnInit {

  @Input() usuarios: Usuario[] = [];
  @Input() mensajes: Mensaje[] = [];
  user_id: number = -1;
  fecha: string = '';
  producto_id: number = -1;

  constructor(private api: ApiService, private modalService: NgbModal, private storage: SessionStorageService, private crud: CrudService) {
    crud.emitter.subscribe(result => {
      if (result == 'loadmensajes' || result == 'loadall') {
        this.loadUsuario();
        this.loadMensajes();
      }
    })
  }

  ngOnInit(): void {
    this.loadUsuario();
    this.loadMensajes();
  }



  loadUsuario() {
    this.api.getUsuarios().subscribe((result) => {
      if (result.length > 0) {
        if (this.storage.retrieve('usuario').usuario != 'kuroko') {
          this.usuarios = result.filter((item) => item != result[0]);
        } else
          this.usuarios = result;
      } else this.usuarios = [];
    });
  }

  loadMensajes() {
    this.api.getMensajes().subscribe(result => {
      this.mensajes = result;
    })
  }

  delete(mensaje: Mensaje) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = mensaje.id;
    modal.componentInstance.modalHeader = 'Mensaje';
    modal.result.then((result) => {
      if (result) {
        this.loadMensajes();
      }
    });
  }

  responderMensaje(mensaje: Mensaje) {
    let modal = this.modalService.open(ModalMensajeComponent, { backdrop: 'static' });
    modal.componentInstance.mensaje = mensaje;
    modal.result.then(result => {
      if (result) {
        this.loadMensajes();
      }
    })
  }
}
