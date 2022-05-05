import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ transform: 'translateX(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);
@Component({
  selector: 'app-modal-login-or-register',
  templateUrl: './modal-login-or-register.component.html',
  styleUrls: ['./modal-login-or-register.component.css'],
  animations: [listAnimation,
    trigger('scaleAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-50%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(-50%)', opacity: 0 })),
      ]),
    ]),
  ],
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
    pais: '',
    direccion: '',
  }

  errorLogin: boolean = false;

  success: boolean = false;
  errorRegister: boolean = false;

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
        // password: result.usuario[0].password,
        nombre: result.usuario[0].nombre,
        fecha: result.usuario[0].fecha,
        correo: result.usuario[0].correo,
        pais: result.usuario[0].correo,
        direccion: result.usuario[0].correo,
        telefono: result.usuario[0].correo,
        rol: result.usuario[0].rol,
        token: result.token,
      };
      this.errorLogin = false;
      this.actiModal.close(result);
    }, err => {
      this.errorLogin = true;
    })
  }

  registEr() {
    let formData = new FormData();
    formData.append('usuario', this.register.usuario);
    formData.append('nombre', this.register.nombre);
    formData.append('password', this.register.password);
    formData.append('correo', this.register.correo);
    formData.append('pais', this.register.pais);
    formData.append('direccion', this.register.direccion);
    formData.append('telefono', this.register.telefono);
    formData.append('rol', 'usuario');
    this.api.addUsuarios(formData).subscribe((result) => {
      this.errorRegister = true;
      this.success = true;
      // this.actiModal.close();
    }, error => {
      this.errorRegister = true;
    })
  }

  validateEmail() {
    return this.register.correo.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null;
  }

  validateVacio() {
    return this.register.usuario.length > 0 &&
      this.register.nombre.length > 0 &&
      this.register.correo.length > 0 &&
      this.register.password.length > 0;
  }

}
