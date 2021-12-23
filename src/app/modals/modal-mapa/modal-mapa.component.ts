import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-mapa',
  templateUrl: './modal-mapa.component.html',
  styleUrls: ['./modal-mapa.component.css'],
})
export class ModalMapaComponent implements OnInit {
  actiModal: NgbActiveModal;
  zoom: number = 1;
  constructor(private activeModal: NgbActiveModal) {
    this.actiModal = this.actiModal;
  }

  ngOnInit(): void {

  }

  zoomIn() {
    this.zoom += 0.1;
    document.getElementById('imagen').style.transform = "scale(" + this.zoom + ")";
  }

  zoomOut() {
    this.zoom -= 0.1;
    document.getElementById('imagen').style.transform = "scale(" + this.zoom + ")";
  }

  zoomChange(){
    document.getElementById('imagen').style.transform = "scale(" + this.zoom + ")";
  }
}
