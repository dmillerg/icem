import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrap } from 'src/app/models/scrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-scrap',
  templateUrl: './modal-scrap-prueba.component.html',
  styleUrls: ['./modal-scrap-prueba.component.css'],
})
export class ModalScrapPruebaComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  btn_name: string = 'Activar';

  scrap: any = {
    titulo: '',
    fecha: '',
    descripcion: '',
    enlace: '',
    imagen: '',
  };

  scrap_origen: Scrap;
  logo: string = '';


  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    if (this.scrap_origen.activo) {
      this.btn_name = "Desactivar";
    } else this.btn_name = "Activar";
  }

  toggleActivate() {
    let formData = new FormData();
    formData.append('id', this.scrap_origen.id.toString());
    formData.append('contenedor', this.scrap_origen.contenedor.toString());
    formData.append('titulo', this.scrap_origen.titulo.toString());
    formData.append('fecha', this.scrap_origen.fecha.toString());
    formData.append('descripcion', this.scrap_origen.descripcion.toString());
    formData.append('enlace_selector', this.scrap_origen.enlace_selector.toString());
    formData.append('enlace_attr', this.scrap_origen.enlace_attr.toString());
    formData.append('imagen_selector', this.scrap_origen.imagen_selector.toString());
    formData.append('imagen_attr', this.scrap_origen.imagen_attr.toString());
    formData.append('url', this.scrap_origen.url.toString());
    formData.append('fuente', this.scrap_origen.fuente.toString());
    formData.append('logo', this.scrap_origen.logo.toString());
    formData.append('activo', !this.scrap_origen.activo + "");
    this.api.updateScrap(formData, this.scrap_origen.id).subscribe((result) => {
      this.actiModal.close('activo');
    })
  }
}
