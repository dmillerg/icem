import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { MessageServiceService } from 'src/app/services/message-service.service';

@Component({
  selector: 'app-modal-user-reset-password',
  templateUrl: './modal-user-reset-password.component.html',
  styleUrls: ['./modal-user-reset-password.component.css']
})
export class ModalUserResetPasswordComponent implements OnInit {

  password: string = '';
  confirm: string = '';
  actiModal: NgbActiveModal;
  id: number = -1;
  usuario: Usuario = {
    id: -1,
    usuario: 'Usuario9706',
    password: '',
    nombre: '',
    fecha: '',
    ultsession: '',
    correo: '',
    pais: '',
    direccion: '',
    telefono: '',
    rol: '',
    activo: false,
  };

  constructor(private api: ApiService,
    private message: MessageServiceService,
    private activeModal: NgbActiveModal,
    private activatedRoute: ActivatedRoute) { 
      this.actiModal = activeModal;
    }

  ngOnInit(): void {
    this.loadURL();
  }

  loadURL() {
    this.activatedRoute.queryParams.subscribe(params => {
      let url = params['reset'];
      if (url != undefined) {
        this.id = Number(url.substring(url.indexOf('Edd') + 3, url.indexOf('Dde')));
        console.log(url);
        this.loadUsuario();
      }
    });
  }

  loadUsuario() {
    this.api.getUsuariosById(this.id).subscribe((result) => {
      this.usuario = result;
    });
  }

  cambiarPass(){
    let formData = new FormData();
    formData.append('id_usuario', this.id.toString());
    formData.append('new_password', this.password);
    this.api.adminResetPassword(formData).subscribe((result)=>{
      this.message.success('', 'Contraseña cambiada correctamente');
      this.actiModal.close();
    }, error=>{
      this.message.error('', 'Error al intentar cambiar la contraseña, por favor intentelo mas tarde');
    })
  }
}
