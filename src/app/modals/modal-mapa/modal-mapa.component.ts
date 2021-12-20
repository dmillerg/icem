import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-mapa',
  templateUrl: './modal-mapa.component.html',
  styleUrls: ['./modal-mapa.component.css'],
})
export class ModalMapaComponent implements OnInit {
  actiModal: NgbActiveModal;
  constructor(private activeModal: NgbActiveModal) {
    this.actiModal = this.actiModal;
  }

  ngOnInit(): void {

  }

  zoomMap(){

  }
}
