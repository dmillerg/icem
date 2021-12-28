import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'protractor';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalScrapPruebaComponent } from 'src/app/modals/modal-scrap-prueba/modal-scrap-prueba.component';
import { ModalScrapComponent } from 'src/app/modals/modal-scrap/modal-scrap.component';
import { Scrap } from 'src/app/models/scrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-scrap',
  templateUrl: './table-scrap.component.html',
  styleUrls: ['./table-scrap.component.css'],
})
export class TableScrapComponent implements OnInit {
  @Input() scraps: Scrap[];
  loadingTest: boolean = false;
  constructor(private api: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadScrap();
  }

  loadScrap() {
    this.api.getScraps().subscribe((result) => {
      if (result.length > 0) {
        this.scraps = result;
      }
      else this.scraps = [];
    });
  }

  updateScrap(scrap) {
    let modal = this.modalService.open(ModalScrapComponent, { size: 'lg' });
    modal.componentInstance.modalHeader = 'Scraps';
    modal.componentInstance.modalSubHeader = 'recogida de noticias de varios sitios';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.scrap = scrap;
    modal.result.then((result) => {
      if (result) {
        this.loadScrap();
      }
    });
  }

  delete(scrap: Scrap) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = scrap.id;
    modal.componentInstance.modalHeader = 'Scraps';
    modal.result.then((result) => {
      if (result) {
        this.loadScrap();
      }
    });
  }

  probarScrap(item) {
    this.loadingTest = true;
    this.api.probarScrap(item.id, new FormData()).subscribe((result) => {
      let modal = this.modalService.open(ModalScrapPruebaComponent, { size: 'lg' });
      modal.componentInstance.scrap = result[0];
      modal.componentInstance.logo = item.logo;
      modal.componentInstance.scrap_origen = item;
      modal.result.then((result) => {
        this.loadScrap();
      });
      this.loadingTest = false;
    }, (error) => {
      console.log(error);
      this.loadingTest = false;
    })
  }

  toggleActivate(item) {
    let formData = new FormData();
    formData.append('id', item.id.toString());
    formData.append('contenedor', item.contenedor.toString());
    formData.append('titulo', item.titulo.toString());
    formData.append('fecha', item.fecha.toString());
    formData.append('descripcion', item.descripcion.toString());
    formData.append('enlace_selector', item.enlace_selector.toString());
    formData.append('enlace_attr', item.enlace_attr.toString());
    formData.append('imagen_selector', item.imagen_selector.toString());
    formData.append('imagen_attr', item.imagen_attr.toString());
    formData.append('url', item.url.toString());
    formData.append('fuente', item.fuente.toString());
    formData.append('logo', item.logo.toString());
    formData.append('activo', !item.activo + "");
    this.api.updateScrap(formData, item.id).subscribe((result) => {
     this.loadScrap();
    })
  }
}
