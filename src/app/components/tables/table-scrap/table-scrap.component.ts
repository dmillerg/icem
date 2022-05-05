import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
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
  loadingScrap: boolean = false;
  messageScrap: string = 'Iniciar Scrap';
  time: number = 0;
  constructor(private api: ApiService, private modalService: NgbModal, private storage: SessionStorageService) { }

  ngOnInit(): void {
    this.loadScrap();
    this.time = Number(this.storage.retrieve('configuraciones')[1].config)*3600000
    console.log(Number(this.storage.retrieve('configuraciones')[1].config));
    
  }

  loadScrap() {
    this.api.getScraps().subscribe((result) => {
      if (result.length > 0) {
        this.scraps = result;
        this.loadMessage();
      }
      else {
        this.scraps = [];
        this.loadMessage();
      }
    });
  }

  loadMessage() {
    if (this.storage.retrieve('messageScrap')) {
      this.messageScrap = this.storage.retrieve('messageScrap');
    }
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

  loadScrapin() {
    if (this.messageScrap == 'Iniciar Scrap') {
      this.loadingScrap = true;
      this.messageScrap = 'Iniciando Scrapping...'
      this.api.IniciarScrap(this.time).subscribe((result) => {
        this.messageScrap = 'Scrapping iniciado cada 1 hora';
        setTimeout(() => {
          this.messageScrap = 'Detener Scrapping';
          this.loadingScrap = false;
        }, 2000);
      });
      this.storage.store('messageScrap', 'Detener Scrap');
    } else {
      this.api.DetenerScrap().subscribe((result) => {
        this.messageScrap = 'Iniciar Scrap';
        this.storage.store('messageScrap', 'Iniciar Scrap');
      })
    }
  }
}
