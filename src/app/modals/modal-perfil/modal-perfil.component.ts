import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { MessageServiceService } from 'src/app/services/message-service.service';
import { ModalAdminComponent } from '../modal-admin/modal-admin.component';
import { ModalCarritoComponent } from '../modal-carrito/modal-carrito.component';

@Component({
  selector: 'app-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.css']
})
export class ModalPerfilComponent implements OnInit {

  usuario: any = {
    id: -1,
    usuario: '',
    nombre: '',
    password: '',
    correo: '',
    fecha: '',
    pais: '',
    telefono: '',
    direccion: '',
    rol: '',
    ultsession: '',
    token: ''
  };
  timeUser: string = '';
  pedidos: any[] = [];
  show_form_password: boolean = false;
  pass_old: string = '';
  new_password: string = '';
  confirm: string = '';

  edit: boolean = false;
  actiModal: NgbActiveModal;
  sidebarpedidos: boolean = false;

  fechalist: string = '';

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, public storage: SessionStorageService, private api: ApiService, private message: MessageServiceService) {
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
      this.usuario.pais = user.pais;
      this.usuario.direccion = user.direccion;
      this.usuario.telefono = user.telefono;
      this.usuario.rol = user.rol;
      this.usuario.token = user.token;
    }
    this.api.calcularTiempo(this.usuario.fecha).subscribe((result) => {
      this.timeUser = result[0].tiempo + ' dias'
    })
    this.loadPedidos();

  }

  loadPedidos() {
    this.pedidos = [];
    this.api.getPedidos(this.usuario.id).subscribe(result => {
      console.log(result);
      this.convertirData(result);
    })
  }

  pedidosDetails() {
    this.sidebarpedidos = !this.sidebarpedidos;
  }

  convertirData(result: any[]) {
    result.forEach(item => {
      let date = new Date(item.fecha)
      let t = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
      let transcurrido = item.tiempo == 0 ? 'hoy' : item.tiempo == 1 ? 'ayer' : item.tiempo + ' dias';
      console.log(transcurrido);

      if (this.fechalist != transcurrido && this.fechalist != t) {
        this.fechalist = t;
        if (item.tiempo < 10) {
          if (item.tiempo == 0) {
            this.fechalist = 'hoy';
          } else if (item.tiempo == 1) {
            this.fechalist = 'ayer';
          } else
            this.fechalist = item.tiempo + ' dias';
        }
        this.pedidos.push({ fechalist: this.fechalist });
      }
      item.producto = result;
      this.pedidos.push(item)
    });
  }


  eliminarPedido(item: any) {
    this.api.deletePedido(item.id).subscribe((result) => {
      this.loadPedidos();
    })
  }

  logout() {
    const user = this.storage.retrieve('usuario');
    if (user != undefined) {
      this.api.logout(user.id).subscribe((result) => {
        this.storage.clear('usuario');
        this.actiModal.close();
      });
    }
  }

  changePassword() {
    let formData: FormData = new FormData();
    formData.append('usuario', this.usuario.usuario);
    formData.append('id_usuario', this.usuario.id.toString());
    formData.append('pass_old', this.pass_old);
    formData.append('new_password', this.new_password);
    this.api.changePassword(formData).subscribe((result) => {
      console.log(result);
      this.mostrarFormPass();
      this.message.success('', result.message)
    }, (error) => {
      this.message.error('', error.error.message)
      console.log(error);
    }
    )
  }

  mostrarFormPass() {
    this.sidebarpedidos = false;
    this.show_form_password = !this.show_form_password;
  }

  resetearFalse() {
    this.sidebarpedidos = false;
    this.show_form_password = false;
    this.edit = false;
  }

  editPerfil() {
    this.sidebarpedidos = false;
    this.resetearFalse();
    let formData = new FormData();
    formData.append('id', this.usuario.id.toString());
    formData.append('usuario', this.usuario.usuario.toString());
    formData.append('nombre', this.usuario.nombre.toString());
    formData.append('fecha', this.usuario.fecha.toString());
    formData.append('correo', this.usuario.correo.toString());
    formData.append('pais', this.usuario.pais.toString());
    formData.append('direccion', this.usuario.direccion.toString());
    formData.append('telefono', this.usuario.telefono.toString());
    formData.append('rol', this.usuario.rol.toString());
    this.api.updateUsuarioWithOutPass(formData, this.usuario.id).subscribe((result) => {
      this.message.success('', 'Datos del perfil actualizados satisfactoriamente');
      this.edit = !this.edit;
      this.storage.store('usuario', this.usuario);
    }, error => {
      this.message.error('', 'En estos momentos no se puede editar el perfil por favor intentelo mas tarde');
      this.edit = !this.edit;
    });
  }

  administrar() {
    this.actiModal.close();
    let modal = this.modalService.open(ModalAdminComponent, { size: 'lg' });
  }

  administrarCarrito(){
    this.actiModal.close();
    let modal = this.modalService.open(ModalCarritoComponent, { size: 'md' });
  }
}
