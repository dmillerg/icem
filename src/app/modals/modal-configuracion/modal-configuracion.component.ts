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

  configuracion: Configuracion;
  actiModal: NgbActiveModal;
  medida: string = 'seg';
  medidas = ['seg', 'min', 'hora', 'dia'];
  tiempo: boolean = false;
  constructor(private activeModal: NgbActiveModal, private api: ApiService, private storage: SessionStorageService) { 
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
  }


  max() {
    let result = 999;
    if (this.tiempo) {
      switch (this.medida) {
        case 'seg':
          result = 60;
          break;
        case 'min':
          result = 60;
          break;
        case 'hora':
          result = 24;
          break;
        case 'dia':
          result = 999;
          break;
      }
    }
    if (Number(this.configuracion.config) > result) {
      this.configuracion.config = result.toString();
    }
    return result;
  }

  aplicarCambio(){
    let result =  Number(this.configuracion.config);
    if(this.tiempo){
      let num = result;
      switch (this.medida) {
        case 'seg':
          result = num/3600;
          break;
        case 'min':
          result = num/60
          break;
        case 'hora':
          result = num;
          break;
        case 'dia':
          result = num*24;
          break;
      }
      console.log(result);
    }
    let formData : FormData=new FormData();
    formData.append('id', this.configuracion.id.toString());
    formData.append('nombre', this.configuracion.nombre.toString());
    formData.append('config', result.toString());
    this.api.saveConfigs(formData).subscribe((result)=>{
      console.log(result);
      this.storage.store('configuraciones',[]);
      this.actiModal.close(true);
    });
  }
}
