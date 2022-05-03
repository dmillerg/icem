import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { MessageServiceService } from 'src/app/services/message-service.service';
import { ModalAdminComponent } from '../modal-admin/modal-admin.component';

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

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, private storage: SessionStorageService, private api: ApiService, private message: MessageServiceService) {
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

      this.api.calcularTiempo(t + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()).subscribe(r => {
        this.api.getProductosById(item.producto_id).subscribe(result => {
          let transcurrido = r[0].tiempo == 0 ? 'hoy' : 'ayer';
          if (this.fechalist != r[0].tiempo + ' dias' && this.fechalist != transcurrido) {
            this.fechalist = t;
            if (r[0].tiempo < 10) {
              if (r[0].tiempo == 0) {
                this.fechalist = 'hoy';
              } else if (r[0].tiempo == 1) {
                this.fechalist = 'ayer';
              } else
                this.fechalist = r[0].tiempo + ' dias';
            }
            this.pedidos.push({ fechalist: this.fechalist });
          }
          item.producto = result;
          this.pedidos.push(item)
        })
      });
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
    this.resetearFalse();
    let formData = new FormData();
    formData.append('id', this.usuario.id.toString());
    formData.append('usuario', this.usuario.usuario.toString());
    formData.append('nombre', this.usuario.nombre.toString());
    formData.append('fecha', this.usuario.fecha.toString());
    formData.append('correo', this.usuario.correo.toString());
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
    let modal = this.modalService.open(ModalAdminComponent, {size: 'lg'});
  }
}