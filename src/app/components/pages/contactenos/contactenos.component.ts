import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(public storage: SessionStorageService, private api: ApiService) { }

  ngOnInit(): void {
    if (this.storage.retrieve('usuario')) {
      let user = this.storage.retrieve('usuario');
      this.alias = user.usuario;
      this.correo = user.correo;
    }
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
}
