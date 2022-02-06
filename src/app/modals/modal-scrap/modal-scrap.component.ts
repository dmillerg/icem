import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/models/categoria';
import { Scrap } from 'src/app/models/scrap';
import { ApiService } from 'src/app/services/api.service';
import { ModalScrapPruebaComponent } from '../modal-scrap-prueba/modal-scrap-prueba.component';

@Component({
  selector: 'app-modal-scrap',
  templateUrl: './modal-scrap.component.html',
  styleUrls: ['./modal-scrap.component.css'],
})
export class ModalScrapComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  scrap: Scrap = {
    id: -1,
    contenedor: '',
    titulo: '',
    fecha: '',
    descripcion: '',
    imagen_selector: '',
    imagen_attr: '',
    enlace_selector: '',
    enlace_attr: '',
    url: '',
    fuente: '',
    logo: '',
    activo: false,
  };

  scrap_pasado: Scrap = {
    id: -1,
    contenedor: '',
    titulo: '',
    fecha: '',
    descripcion: '',
    imagen_selector: '',
    imagen_attr: '',
    enlace_selector: '',
    enlace_attr: '',
    url: '',
    fuente: '',
    logo: '',
    activo: false,
  };

  loadingTest: boolean = false;

  constructor(private activeModal: NgbActiveModal, private api: ApiService, private modalService: NgbModal) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.scrap_pasado.id = this.scrap.id;
      this.scrap_pasado.contenedor = this.scrap.contenedor;
      this.scrap_pasado.titulo = this.scrap.titulo;
      this.scrap_pasado.fecha = this.scrap.fecha;
      this.scrap_pasado.descripcion = this.scrap.descripcion;
      this.scrap_pasado.enlace_selector = this.scrap.enlace_selector;
      this.scrap_pasado.enlace_attr = this.scrap.enlace_attr;
      this.scrap_pasado.imagen_selector = this.scrap.imagen_selector;
      this.scrap_pasado.imagen_attr = this.scrap.imagen_attr;
      this.scrap_pasado.url = this.scrap.url;
      this.scrap_pasado.fuente = this.scrap.fuente;
      this.scrap_pasado.logo = this.scrap.logo;
    }
  }

  addUpdateScrap() {
    let formData = new FormData();
    formData.append('id', this.scrap.id.toString());
    formData.append('contenedor', this.scrap.contenedor.toString());
    formData.append('titulo', this.scrap.titulo.toString());
    formData.append('fecha', this.scrap.fecha.toString());
    formData.append('descripcion', this.scrap.descripcion.toString());
    formData.append('enlace_selector', this.scrap.enlace_selector.toString());
    formData.append('enlace_attr', this.scrap.enlace_attr.toString());
    formData.append('imagen_selector', this.scrap.imagen_selector.toString());
    formData.append('imagen_attr', this.scrap.imagen_attr.toString());
    formData.append('url', this.scrap.url.toString());
    formData.append('fuente', this.scrap.fuente.toString());
    formData.append('logo', this.scrap.logo.toString());
    formData.append('activo', this.scrap.activo.toString());

    if (this.modalAction == 'Editar') {
      this.api.updateScrap(formData, this.scrap.id).subscribe(
        (result) => {
          this.actiModal.close('Scraps');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Scraps');
          console.log(error);
        }
      );
    } else {
      this.api.addScrap(formData).subscribe(
        (result) => {
          this.actiModal.close('Scraps');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Scraps');
          console.log(error);
        }
      );
    }
  }

  probarScrap() {
    this.loadingTest = true;
    let formData = new FormData();
    formData.append('id', this.scrap.id.toString());
    formData.append('contenedor', this.scrap.contenedor.toString());
    formData.append('titulo', this.scrap.titulo.toString());
    formData.append('fecha', this.scrap.fecha.toString());
    formData.append('descripcion', this.scrap.descripcion.toString());
    formData.append('enlace_selector', this.scrap.enlace_selector.toString());
    formData.append('enlace_attr', this.scrap.enlace_attr.toString());
    formData.append('imagen_selector', this.scrap.imagen_selector.toString());
    formData.append('imagen_attr', this.scrap.imagen_attr.toString());
    formData.append('url', this.scrap.url.toString());
    formData.append('fuente', this.scrap.fuente.toString());
    formData.append('logo', this.scrap.logo.toString());

    this.api.probarScrap(-1,formData).subscribe((result) => {
      let modal = this.modalService.open(ModalScrapPruebaComponent, { size: 'lg' });
      modal.componentInstance.scrap = result[0];
      modal.componentInstance.logo = this.scrap.logo;
      modal.componentInstance.scrap_origen = this.scrap;
      modal.result.then((result)=>{
        this.actiModal.close('Scraps');
      })
      this.loadingTest = false;
    })
  }
}
