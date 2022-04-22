import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.css']
})
export class ModalPerfilComponent implements OnInit {

  usuario: Usuario = {
    id: -1,
    usuario: '',
    nombre: '',
    password: '',
    correo: '',
    fecha: '',
    rol: '',
    ultsession: ''
  };
  actiModal: NgbActiveModal;

  constructor(private activeModal: NgbActiveModal, private storage: SessionStorageService) {
    this.actiModal = activeModal;
   }

  ngOnInit(): void {
    if(this.storage.retrieve('usuario')){
      let user = this.storage.retrieve('usuario');
      this.usuario.id = user.id;
      this.usuario.usuario = user.usuario;
      this.usuario.correo = user.correo;
      this.usuario.nombre = user.nombre;
      this.usuario.fecha = user.fecha;
      this.usuario.rol = user.rol
    }
  }

}
