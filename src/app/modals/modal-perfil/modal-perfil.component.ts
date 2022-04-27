import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

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
  timeUser: string = '';
  pedidos: Pedido[] = [];

  edit: boolean = false;
  actiModal: NgbActiveModal;

  constructor(private activeModal: NgbActiveModal, private storage: SessionStorageService, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    if (this.storage.retrieve('usuario')) {
      let user = this.storage.retrieve('usuario');
      this.usuario.id = user.id;
      this.usuario.usuario = user.usuario;
      this.usuario.correo = user.correo;
      this.usuario.nombre = user.nombre;
      this.usuario.fecha = user.fecha;
      this.usuario.rol = user.rol;
    }
    this.api.all(`SELECT TIMESTAMPDIFF(DAY,'${this.usuario.fecha}',NOW()) as tiempo`).subscribe((result) => {
      this.timeUser = result[0].tiempo + ' dias'
    })
    this.loadPedidos();

  }

  loadPedidos() {
    this.api.getPedidos(this.usuario.id).subscribe(result => {
      this.pedidos = result;
    })
  }

  pedidosDetails() {
    if (document.getElementById('pedidos').classList.contains('actived')) {
      document.getElementById('pedidos').classList.remove('actived')
    }
    document.getElementById('pedidos').classList.toggle('active');
  }

  pedidosCompleteDetails() {
    document.getElementById('btn-ampliar').classList.toggle('active');
    if (document.getElementById('pedidos').classList.contains('active')) {
      document.getElementById('pedidos').classList.remove('active')
    }
    document.getElementById('pedidos').classList.toggle('actived');
  }
}
