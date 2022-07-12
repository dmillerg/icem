import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Mensaje } from 'src/app/models/mensaje';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-mensaje',
  templateUrl: './modal-mensaje.component.html',
  styleUrls: ['./modal-mensaje.component.css'],
})
export class ModalMensajeComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  mensaje: any;
  respuesta: string = '';

  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {

  }

  addUpdatePosts() {
    let formData = new FormData();
    formData.append('pregunta', this.mensaje.mensaje.toString());
    formData.append('respuesta', this.respuesta);
    this.api.sendEmail(this.mensaje.correo, 'Respuesta a su pregunta o duda', this.respuesta, 'respuesta').subscribe((result) => {
      this.api.updateMensaje(this.mensaje.id, formData).subscribe(resultado => {
        this.actiModal.close();
      });
    }, error => {
      console.log('Error respuesta correo ', error);
    });
  }
}
