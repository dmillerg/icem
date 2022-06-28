import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

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

  constructor(public storage: SessionStorageService) { }

  ngOnInit(): void {
  }

  validarMensaje() {
    return this.alias != '' && this.correo != '' && this.asunto != '' && this.mensaje != '';
  }

  enviarMensaje(){
    
  }
}
