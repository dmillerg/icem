import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { ModalUsuarioComponent } from 'src/app/modals/modal-usuario/modal-usuario.component';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-usuario',
  templateUrl: './table-usuario.component.html',
  styleUrls: ['./table-usuario.component.css'],
})
export class TableUsuarioComponent implements OnInit {
  @Input() usuarios: Usuario[];
  constructor(private api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadUsuario();
  }

  loadUsuario() {
    this.api.getUsuarios().subscribe((result) => {
      if (result.length > 0) {
        this.usuarios = result.filter(item => item != result[0])
      }
      else this.usuarios = [];
    });
  }

  updateUsuario(usuario) {
    let modal = this.modalService.open(ModalUsuarioComponent, { size: 'lg' });
    modal.componentInstance.modalHeader = 'Usuario';
    modal.componentInstance.modalSubHeader = 'admin de todo el sitio';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.usuario = usuario;
    modal.result.then((result) => {
      if (result) {
        this.loadUsuario();
      }
    });
  }

  delete(usuario: Producto) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = usuario.id;
    modal.componentInstance.modalHeader = 'Usuarios';
    modal.result.then((result) => {
      if (result) {
        this.loadUsuario();
      }
    });
  }
}
