import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalAdminComponent } from 'src/app/modals/modal-admin/modal-admin.component';
import { ModalMapaComponent } from 'src/app/modals/modal-mapa/modal-mapa.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  showLogin: boolean = false;
  btn_message: string = 'Iniciar sesión';
  usuario: string = '';
  password: string = '';
  user_auth: string = '';
  user: Usuario;
  errorAuth: boolean = false;

  autenticado: boolean = false;
  fechaAct: string = '';

  constructor(
    private modalService: NgbModal,
    private api: ApiService,
    private storage: SessionStorageService
  ) { }

  ngOnInit(): void {
    try {
      this.fechaActualizacion();
      if (this.storage.retrieve('usuario')) {
        this.user_auth = this.storage.retrieve('usuario');
        this.btn_message = 'Administrar';
      }
    } catch (e) {
      console.log(e);
    }
  }

  verMapa() {
    this.modalService.open(ModalMapaComponent, { size: 'lg' });
  }

  showLogins(target: HTMLElement) {
    switch (this.btn_message) {
      case 'Iniciar sesión':
        target.scrollIntoView({ behavior: 'smooth' })
        this.showLogin = true;
        break;
      case 'Cerrar sesión': 
        this.showLogin = false;
        this.autenticado = false;
        this.btn_message = 'Iniciar sesión';
        break;
      case 'Administrar':
        let modal = this.modalService.open(ModalAdminComponent, {
          size: 'lg',
          backdrop: 'static',
        });
        modal.result.then((result) => {
          if (result) this.cancelarLogin();
        });
    }
  }

  login() {
    let formData = new FormData();
    formData.append('usuario', this.usuario);
    formData.append('password', this.password);
    this.api.login(formData).subscribe(
      (result) => {
        console.log('autenticado', result);
        this.autenticado = true;
        this.showLogin = false;
        this.btn_message = 'Administrar';
        const user = {
          id: result.usuario[0].id,
          usuario: result.usuario[0].usuario,
          password: result.usuario[0].password,
          nombre: result.usuario[0].nombre,
          fecha: result.usuario[0].fecha,
          token: result.token,
        };
        this.errorAuth = false;
        this.storage.store('usuario', user);
        this.user = result.usuario[0];
        this.fechaActualizacion();
      },
      (error) => {
        console.log(error);
        this.errorAuth = true;
        this.autenticado = false;
      }
    );
  }

  cancelarLogin() {
    this.user = this.storage.retrieve('usuario');
    if (this.user != undefined) {
      this.api.logout(this.user.id).subscribe((result) => {
        this.storage.clear('usuario');
        this.showLogin = false;
        this.autenticado = false;
        this.btn_message = 'Iniciar sesión';
      });
    }
    this.showLogin = false;
  }

  fechaActualizacion() {
    this.api.ultimaActualizacion().subscribe(result => {
      this.fechaAct = result[0].ultsession;
    });
  }

}
