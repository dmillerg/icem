import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalAdminResetComponent } from 'src/app/modals/modal-admin-reset/modal-admin-reset.component';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { ModalUsuarioComponent } from 'src/app/modals/modal-usuario/modal-usuario.component';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table-usuario',
  templateUrl: './table-usuario.component.html',
  styleUrls: ['./table-usuario.component.css'],
})
export class TableUsuarioComponent implements OnInit {
  @Input() usuarios: any[] = [];
  usuario_query: string = '';
  actividad_query: number = -1;
  fecha_query: string = '';
  loading: boolean = false;
  loading_message: string = 'cargando...';

  constructor(private api: ApiService, private modalService: NgbModal, private storage: SessionStorageService, private crud: CrudService) {
    crud.emitter.subscribe(result => {
      if (result == 'loadusuarios' || result == 'loadall') {
        this.loadUsuario();
      }
    })
   }

  ngOnInit(): void {
    this.loadUsuario();
  }

  loadUsuario() {
    this.loading = true;
    this.api.getUsuarios().subscribe((result) => {
      if (result.length > 0) {
        this.usuarios = this.convertirData(result);
        console.log(this.usuarios);
      } else this.usuarios = [];
      this.loading = result.length == 0 ? true : false;
      this.loading_message = result.length == 0 ? 'no hay usuarios registrados' : ''
    });
  }

  convertirData(result: any) {
    let arr_result: any = [];
    result.forEach(e => {
      this.api.getUserOnlineByID(e.id).subscribe(result => {
        e.online = result.length > 0;
        console.log((result.length));
        
        arr_result.push(e);
      });
    });
    return arr_result;
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

  resetear(usuario: Usuario) {
    let modal = this.modalService.open(ModalAdminResetComponent);
    modal.componentInstance.usuario = usuario;
  }

  activarUsuario(item: Usuario) {
    this.api.activarUsuario(item.id).subscribe((result) => {
      item.activo = true;
    }, error => {
      item.activo = false;
    })
  }
}
