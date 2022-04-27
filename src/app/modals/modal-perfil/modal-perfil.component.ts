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
  pedidos: any[] = [];
  show_form_password: boolean = false;
  pass_old: string = '';
  new_password: string = '';
  confirm: string = '';

  edit: boolean = false;
  actiModal: NgbActiveModal;

  fechalist: string = '';

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
    this.api.calcularTiempo(this.usuario.fecha).subscribe((result) => {
      this.timeUser = result[0].tiempo + ' dias'
    })
    this.loadPedidos();

  }

  loadPedidos() {
    this.pedidos = [];
    this.api.getPedidos(this.usuario.id).subscribe(result => {
      result.forEach(e => {
        this.convertirData(e);
      })
    })
  }

  pedidosDetails() {
    document.getElementById('btn-ampliar').classList.toggle('active');
    document.getElementById('pedidos').classList.toggle('active');
  }

  convertirData(item: any) {
    let date = new Date(item.fecha)
    let t = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    
    this.api.calcularTiempo(t+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()).subscribe(r => {
      this.api.getProductosById(item.producto_id).subscribe(result => {
        if (this.fechalist != r[0].tiempo + ' dias') {
          this.fechalist = t;
          if (r[0].tiempo < 10) {
            this.fechalist = r[0].tiempo + ' dias';
          }
          this.pedidos.push({ fechalist: this.fechalist });
        }
        item.producto = result;
        this.pedidos.push(item)
      })
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
    }, error => { console.log(error); }
    )
  }
}
