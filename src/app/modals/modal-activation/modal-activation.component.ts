import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-activation',
  templateUrl: './modal-activation.component.html',
  styleUrls: ['./modal-activation.component.css']
})
export class ModalActivationComponent implements OnInit {
  id: number = -1;
  usuario: Usuario = {
    id: -1,
    usuario: 'Usuario',
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
  activando: boolean= false;
  constructor(private activatedRoute: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.loadURL();
  }

  loadURL(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      let url = '$10$Qcm6OiMBKaWIbkoZLqTSvO/eNSRWrH6mg3p3crrv8BG157AtEdd321Ddexgs2';
      console.log(url.indexOf('Edd'));
      console.log(url.indexOf('Dde'));
      console.log(url.substring(url.indexOf('Edd')+3,url.indexOf('Dde')));
      
      
      this.loadUsuario();
    });
  }

  loadUsuario() {
    this.api.getUsuariosById(this.id).subscribe((result) => {
      this.usuario = result;
    });
  }

  activandoUsuario(){
    this.activando = true;
    this.api.activarUsuario(this.id).subscribe((result)=>{
      this.activando = false;
    })
  }

}
