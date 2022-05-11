import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Configuracion } from 'src/app/models/configuracion';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-configuracion',
  templateUrl: './modal-configuracion.component.html',
  styleUrls: ['./modal-configuracion.component.css']
})
export class ModalConfiguracionComponent implements OnInit {

  configuracion: Configuracion = {
    id: -1,
    nombre: '',
    descripcion: '',
    config: 0,
  };
  actiModal: NgbActiveModal;
  medida: string = 'seg';
  medidas = ['seg', 'min', 'hora', 'dia'];
  anterior: string = 'seg';
  tiempo: boolean = false;
  constructor(private activeModal: NgbActiveModal, private api: ApiService, private storage: SessionStorageService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.configuracion.config = this.configuracion.config * 3600;
    console.log(this.configuracion.config * 3600);
  }

  onChange() {
    let result = 0;
    let num = this.configuracion.config;
    console.log(this.medida, '    ', this.anterior);
    switch (this.anterior) {
      case 'seg':
        switch (this.medida) {
          case 'seg':
            result = num;
            break;
          case 'min':
            result = num / 60
            break;
          case 'hora':
            result = num / 3600;
            break;
          case 'dia':
            result = num / (24 * 3600);
            break;
        }
        break;
      case 'min':
        switch (this.medida) {
          case 'seg':
            result = num * 60;
            break;
          case 'min':
            result = num;
            break;
          case 'hora':
            result = num / 60;
            break;
          case 'dia':
            result = num / (24 * 60);
            break;
        }
        break;
      case 'hora':
        switch (this.medida) {
          case 'seg':
            result = num * 3600;
            break;
          case 'min':
            result = num * 60
            break;
          case 'hora':
            result = num;
            break;
          case 'dia':
            result = num / 24;
            break;
        }
        break;
      case 'dia':
        switch (this.medida) {
          case 'seg':
            result = num * (24 * 3600);
            break;
          case 'min':
            result = num * (24 * 60)
            break;
          case 'hora':
            result = num * 24;
            break;
          case 'dia':
            result = num;
            break;
        }
        break;
    }
    this.anterior = this.medida;
    this.configuracion.config = result;
    console.log(result);

  }

  aplicarCambio() {
    let result = this.configuracion.config;
    if (this.tiempo) {
      let num = result;
      switch (this.medida) {
        case 'seg':
          result = num / 3600;
          break;
        case 'min':
          result = num / 60;
          console.log(result, 'rrrr');

          break;
        case 'hora':
          result = num;
          break;
        case 'dia':
          result = num * 24;
          break;
      }
      console.log(result);
    }
    let formData: FormData = new FormData();
    formData.append('id', this.configuracion.id.toString());
    formData.append('nombre', this.configuracion.nombre.toString());
    formData.append('config', result.toString());
    this.api.saveConfigs(formData).subscribe((result) => {
      console.log(result);
      this.storage.store('configuraciones', []);
      this.actiModal.close(true);
    });
  }
}
