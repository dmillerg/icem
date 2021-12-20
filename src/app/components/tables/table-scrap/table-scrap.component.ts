import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/modals/modal-delete/modal-delete.component';
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
  constructor(private api: ApiService, private modalService: NgbModal) {}

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
}
