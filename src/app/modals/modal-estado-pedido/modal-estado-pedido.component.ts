import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-estado-pedido',
  templateUrl: './modal-estado-pedido.component.html',
  styleUrls: ['./modal-estado-pedido.component.css']
})
export class ModalEstadoPedidoComponent implements OnInit {

  actiModal: NgbActiveModal;
  id: number = -1;
  estado: string = '';
  estados: any[] = ['reservado', 'en espera', 'finalizado'];

  constructor(private api: ApiService, private activeModal: NgbActiveModal) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
  }

  aplicarCambio() {
    let formData: FormData = new FormData();
    formData.append('estado', this.estado);
    this.api.cambiarEstadoPedido(formData, this.id).subscribe((result) => {
      this.actiModal.close(true);
    });
  }

}
