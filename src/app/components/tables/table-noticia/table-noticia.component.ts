import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
import { ModalNoticiaComponent } from 'src/app/modals/modal-noticia/modal-noticia.component';
import { Noticia } from 'src/app/models/noticias';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-noticia',
  templateUrl: './table-noticia.component.html',
  styleUrls: ['./table-noticia.component.css'],
})
export class TableNoticiaComponent implements OnInit {
  @Input() noticias: Noticia[];
  fuente_query: string = '';
  fuentes: any[] = [];
  categorias: any[];
  fecha_query: string = '';
  fechas: any[] = [];
  all_query: string = '';
  constructor(private api: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadNoticia();
  }

  loadNoticia() {
    this.api.getNoticias().subscribe((result) => {
      if (result.length > 0) this.noticias = this.convertNoticias(result);
      else this.noticias = [];
      result.forEach(item => {
        if (this.fuentes.indexOf(item.fuente) == -1) this.fuentes.push(item.fuente);
        if (this.fechas.indexOf(item.fecha) == -1) this.fechas.push(item.fecha);
      });
    });
  }

  updateNoticia(noticia) {
    let modal = this.modalService.open(ModalNoticiaComponent, { size: 'lg' });
    modal.componentInstance.modalHeader = 'Noticia';
    modal.componentInstance.modalSubHeader = 'lo mas reciente en el ICEM';
    modal.componentInstance.modalAction = 'Editar';
    modal.componentInstance.noticia = noticia;
    modal.result.then((result) => {
      if (result) {
        this.loadNoticia();
      }
    });
  }

  delete(noticia: Noticia) {
    let modal = this.modalService.open(ModalDeleteComponent, { size: 'sm' });
    modal.componentInstance.modalId = noticia.id;
    modal.componentInstance.modalHeader = 'Noticias';
    modal.result.then((result) => {
      if (result) {
        this.loadNoticia();
      }
    });
  }

  convertNoticias(result: Noticia[]) {
    result.forEach(e => {
      if (e.fuente == 'ICEM') {
       e.imagen =environment.url_backend+`pictures/${e.id}?tipo=noticias`
      }
    });
    return result;
  }
}
