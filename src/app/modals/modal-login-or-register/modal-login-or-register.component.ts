import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { MessageServiceService } from 'src/app/services/message-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-login-or-register',
  templateUrl: './modal-login-or-register.component.html',
  styleUrls: ['./modal-login-or-register.component.css'],
  animations: [listAnimation,scaleAnimation],
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

  correo: string = '';

  cargaemail: boolean = false;
  remember: boolean = false;
  errorLogin: boolean = false;

  registerLoading: boolean = false;
  activateLoading: boolean = false;
  loginLoading: boolean = false;

  success: boolean = false;
  errorRegisterUser: boolean = false;
  errorRegisterEmail: boolean = false;
  activarCuenta: boolean = false;

  idLogin: number = -1;

  constructor(private activeModal: NgbActiveModal,
    private api: ApiService,
    private message: MessageServiceService,
    private localstorage: LocalStorageService) {
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
    this.loginLoading = true;
    let formData = new FormData()
    formData.append('usuario', this.login.usuario);
    formData.append('password', this.login.password);
    formData.append('recordar', this.remember.toString());
    this.api.login(formData).subscribe((result) => {
      const user = {
        id: result.usuario[0].id,
        usuario: result.usuario[0].usuario,
        // password: result.usuario[0].password,
        nombre: result.usuario[0].nombre,
        fecha: result.usuario[0].fecha,
        correo: result.usuario[0].correo,
        pais: result.usuario[0].pais,
        direccion: result.usuario[0].direccion,
        telefono: result.usuario[0].telefono,
        rol: result.usuario[0].rol,
        token: result.token,
      };
      if (this.remember) {
        this.localstorage.store('usuario', user);
      }
      this.loginLoading = false;
      this.errorLogin = false;
      this.actiModal.close(result);
    }, err => {
      if (err.error.message == 'Este usuario no esta activo') {
        this.activarCuenta = true;
        this.loginLoading = false;
        this.idLogin = err.error.id;
        this.correo = err.error.correo;
      } else {
        this.errorLogin = true;
      }
      this.loginLoading = false;
    })
  }

  registEr() {
    // this.generarLink()
    this.registerLoading = true;
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
      this.sendEmailActivacion(link, this.register.correo);
      // this.actiModal.close();
    }, error => {
      if (error.error.message == 'Este usuario ya esta siendo utilizado') {
        this.errorRegisterUser = true;
      } else if (error.error.message == 'Este correo ya esta siendo utlizado') {
        this.errorRegisterEmail = true;
      }
      this.registerLoading = false;
    })
  }

  sendEmailActivacion(link, correo) {
    this.api.sendEmail(correo,
      'Activación de la cuenta de usuario',
      `Hola ${this.register.usuario ? this.register.usuario : this.login.usuario}, estamos encantados de recibir a un nuevo cliente en nuestra empresa. Para confirmar la activación de su cuenta por favor presione el botón que se le presenta debajo. Esperamos su visita pronto!!.`,
      'Si usted no es el que pidió la activación de la cuenta simplemente borre este correo, no se preocupe su correo no podrá ser usado sin su autorización.',
      'link',
      link,
      `${environment.url_page}/#/inicio?link=${link}`).subscribe((resul) => {
        this.errorRegisterUser = true;
        this.success = true;
        this.registerLoading = false;
        this.activateLoading = false;
        this.activarCuenta = false;
      }, error => {
        this.registerLoading = false;
        this.activateLoading = false;
        this.message.error('', 'No se pudo mandar el correo de verificación, por favor intentelo mas tarde');
      });
  }

  activateAccount() {
    this.activateLoading = true;
    let link = this.generarLink(this.idLogin);
    this.sendEmailActivacion(link, this.correo);
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
        this.cargaemail = true;
        this.api.getUsuariosByEmail(this.login.usuario).subscribe((result) => {
          this.sendEmailForgotPassword(result);
        });
      } else {
        this.cargaemail = true;
        this.api.getUsuariosByUser(this.login.usuario).subscribe((result) => {
          this.sendEmailForgotPassword(result);
        });
      }
    } else {
      this.message.error('','debe rellenar el campo usuario o correo con alguno de estos elementos para poder saber quien es usted, luego presione sobre olvido su contraseña');
    }

  }

  sendEmailForgotPassword(user: Usuario) {
    let reset = this.generarLink(user.id);
    this.api.sendEmail(user.correo,
      'Contraseña olvidada por el usuario ' + this.login.usuario,
       `Hola ${this.login.usuario}, hemos notado que ha olvidado su contraseña, no hay de que preocuparse solo presione el botón a continuación para confirmar su identidad.`,
      `En caso de que el botón no funcionará solo siga el link: ${environment.url_page}/#/inicio?reset=${reset}`,
      'reset',
      reset,
      `${environment.url_page}/#/inicio?reset=${reset}`
    ).subscribe((resul) => {
      this.errorRegisterUser = true;
      this.cargaemail = false;
      this.success = true;
      this.message.success('', 'Se ha enviado un correo de restablecimiento de contraseña')
      this.actiModal.close();
    })
  }
}
