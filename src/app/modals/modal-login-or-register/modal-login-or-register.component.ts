import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { MessageServiceService } from 'src/app/services/message-service.service';

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

  errorMessage: string = '';

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

  constructor(private activeModal: NgbActiveModal, private api: ApiService, private message: MessageServiceService) {
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
    // this.generarLink()
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
      let link = this.generarLink(result.result.insertId);
      this.api.sendEmail(this.register.correo, 'Activacion de la cuenta de usuario para ' + this.register.usuario, `Para activar su cuenta y poder acceder a nuestro sitio debe presionar el link que se le manda a continuacion \n http://localhost:4200/#/inicio?link=${link}`).subscribe((resul) => {
        this.errorRegister = true;
        this.success = true;
      })
      // this.actiModal.close();
    }, error => {
      this.errorRegister = true;
    })
  }

  generarLink(id: any) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-*';
    const l = chars.length;
    let cant = Math.floor(Math.random() * (30 - 20)) + 20;
    let replaces = 'Edd' + id + 'Dde';
    let place = Math.floor(Math.random() * (cant - 0)) + 0;
    for (let i = 0; i < cant; i++) {
      if (i == place) {
        result += replaces;
      }
      result += chars[Math.floor(Math.random() * (l - 0)) + 0]
    }
    console.log(result);
    return result;
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

  forgetPassword() {
    if (this.login.usuario != '') {
      if (this.login.usuario.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null) {
        this.api.getUsuariosByEmail(this.login.usuario).subscribe((result) => {
          this.sendEmailForgotPassword(result);
        });
      } else {
        
        this.api.getUsuariosByUser(this.login.usuario).subscribe((result) => {
          this.sendEmailForgotPassword(result);
        });
      }
    } else {
      this.errorMessage = 'debe rellenar el campo usuario o correo con alguno de estos elementos para poder saber quien es usted, luego presione sobre olvido su contraseña';
    }

  }

  sendEmailForgotPassword(user: Usuario) {
    let reset = this.generarLink(user.id);
    this.api.sendEmail(user.correo, 'Contraseña olvidada por el usuario ' + this.register.usuario, `Para restablecer su contraseña por favor presione el link a continuación: \n http://localhost:4200/#/inicio?reset=${reset}`).subscribe((resul) => {
      this.errorRegister = true;
      this.success = true;
      this.message.success('','Se ha enviado un correo de restablecimiento de contraseña')
      this.actiModal.close()
    })
  }
}
