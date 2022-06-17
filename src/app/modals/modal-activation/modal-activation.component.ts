import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { MessageServiceService } from 'src/app/services/message-service.service';

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
    cant_visitas: 0,
  };
  activando: boolean = false;
  actiModal: NgbActiveModal;
  constructor(private activatedRoute: ActivatedRoute, private api: ApiService, private activeModal: NgbActiveModal, private message: MessageServiceService) {
    this.actiModal = activeModal;
   }

  ngOnInit(): void {
    this.loadURL();
  }

  loadURL() {
    this.activatedRoute.queryParams.subscribe(params => {
      let url = params['link'];
      if (url != undefined) {
        // console.log(url.indexOf('Edd'));
        // console.log(url.indexOf('Dde'));
        // console.log(url.substring(url.indexOf('Edd') + 3, url.indexOf('Dde')));
        this.id = Number(url.substring(url.indexOf('Edd') + 3, url.indexOf('Dde')));
        console.log(url);
        this.loadUsuario();
      }
    });
  }

  loadUsuario() {
    this.api.getUsuariosById(this.id).subscribe((result) => {
      this.usuario = result;
    });
  }

  activandoUsuario() {
    this.activando = true;
    this.api.activarUsuario(this.id).subscribe((result) => {
      this.activando = false;
      this.message.success('', 'Su cuenta se ha activado con exito');
      this.actiModal.close();
    })
  }

}
