import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { ApiService } from 'src/app/services/api.service';
import { MessageServiceService } from 'src/app/services/message-service.service';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent implements OnInit {

  alias: string = '';
  correo: string = '';
  asunto: string = '';
  mensaje: string = '';
  disable: boolean = false;

  constructor(public storage: SessionStorageService, private api: ApiService, private message: MessageServiceService) { }

  ngOnInit(): void {
    if (this.storage.retrieve('usuario')) {
      let user = this.storage.retrieve('usuario');
      this.alias = user.usuario;
      this.correo = user.correo;
    }
    this.storage.observe('usuario').subscribe(() => {
      let user = this.storage.retrieve('usuario');
      if (user) {
        this.alias = user.usuario;
        this.correo = user.correo;
        this.disable = false;
      } else {
        this.alias = '';
        this.correo = '';
      }
    })
  }

  validarMensaje() {
    return this.alias != '' && this.correo != '' && this.asunto != '' && this.mensaje != '';
  }

  enviarMensaje() {
    let formData = new FormData();
    formData.append('alias', this.alias);
    formData.append('correo', this.correo);
    formData.append('asunto', this.asunto);
    formData.append('mensaje', this.mensaje);
    this.api.addMensaje(formData).subscribe((result) => {
      console.log('Mensaje enviado satisfactoriamente');
      this.vaciarCampos();
    }, error => {
      console.error(error);
      this.vaciarCampos();
    });
  }

  vaciarCampos() {
    if (!this.storage.retrieve('usuario')) {
      this.alias = '';
      this.correo = '';
    }
    this.asunto = '';
    this.mensaje = '';
  }

  autenticarseBefore() {
    if (!this.storage.retrieve('usuario')) {
      this.message.success('¿Quién eres?', 'Para poder atender tu pregunta por favor dejanos saber quien eres');
      this.disable = true;
    }
  }
}
