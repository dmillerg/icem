import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css'],
})
export class ModalUsuarioComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  usuario: Usuario = {
    id: -1,
    usuario: '',
    password: '',
    nombre: '',
    fecha: '',
    ultsession: '',
    correo: '',
    rol: '',
  };

  usuario_pasado: Usuario = {
    id: -1,
    usuario: '',
    password: '',
    nombre: '',
    fecha: '',
    ultsession: '',
    correo: '',
    rol: '',
  };

  confirm: string = '';

  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.usuario_pasado.id = this.usuario.id;
      this.usuario_pasado.usuario = this.usuario.usuario;
      this.usuario_pasado.password = this.usuario.password;
      this.usuario_pasado.nombre = this.usuario.nombre;
      this.usuario_pasado.correo = this.usuario.correo;
      this.usuario_pasado.fecha = this.usuario.fecha;
    }
  }

  addUpdateUsuario() {
    let formData = new FormData();
    formData.append('id',this.usuario.id.toString());
    formData.append('usuario',this.usuario.usuario.toString());
    formData.append('password',this.usuario.password.toString());
    formData.append('nombre',this.usuario.nombre.toString());
    formData.append('fecha',this.usuario.fecha.toString());
    formData.append('correo',this.usuario.correo.toString());
    formData.append('rol',this.usuario.rol.toString());

    console.log(this.modalAction)
    if(this.modalAction =="Editar"){
      this.api.updateUsuarioWithOutPass(formData, this.usuario.id).subscribe((result)=>{
        this.actiModal.close('Usuarios');
        console.log(result);
      },(error)=>{
        this.actiModal.close('Usuarios');
        console.log(error);
      });
    } else {
      this.api.addUsuarios(formData).subscribe((result)=>{
        this.actiModal.close('Usuarios');
        console.log(result);
      }, (error)=>{
        console.log(error);
        this.actiModal.close('Usuarios');
      })
    }

  }

}
