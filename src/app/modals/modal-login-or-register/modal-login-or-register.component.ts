import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-login-or-register',
  templateUrl: './modal-login-or-register.component.html',
  styleUrls: ['./modal-login-or-register.component.css']
})
export class ModalLoginOrRegisterComponent implements OnInit {

  actiModal: NgbActiveModal;
  activo = false;

  modalAction: string = '';

  login = {
    usuario: '',
    password: '',
  }

  register = {
    usuario: '',
    password: '',
    confirm_pass: '',
    correo: '',
    nombre: '',
    telefono: '',
  }

  success: boolean = true;

  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    if (this.modalAction == 'Login') {
      this.loginOrRegister();
    }
  }

  loginOrRegister() {
    document.querySelector('.content-total').classList.toggle('active');
    this.activo = !this.activo;
  }

  logIn() {
    let formData = new FormData()
    formData.append('usuario', this.login.usuario);
    formData.append('password', this.login.password);
    this.api.login(formData).subscribe((result) => {
      const user = {
        id: result.usuario[0].id,
        usuario: result.usuario[0].usuario,
        password: result.usuario[0].password,
        nombre: result.usuario[0].nombre,
        fecha: result.usuario[0].fecha,
        correo: result.usuario[0].correo,
        rol: result.usuario[0].rol,
        token: result.token,
      };
      this.actiModal.close(result);
    })
  }

  registEr() {
    let formData = new FormData();
    formData.append('usuario', this.register.usuario);
    formData.append('nombre', this.register.nombre);
    formData.append('password', this.register.password);
    formData.append('correo', this.register.correo);
    this.api.addUsuarios(formData).subscribe((result) => {
      this.success = true;
      // this.actiModal.close();
    })
  }

  validateEmail() {
    return this.register.correo.includes('@') && this.register.correo.includes('.');
  }

  validateVacio() {
    return this.register.usuario.length > 0 &&
      this.register.nombre.length > 0 &&
      this.register.correo.length > 0 &&
      this.register.password.length > 0;
  }

}
