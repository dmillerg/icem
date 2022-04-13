import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-carrito',
  templateUrl: './modal-carrito.component.html',
  styleUrls: ['./modal-carrito.component.css']
})
export class ModalCarritoComponent implements OnInit {

  carrito: any[] = [];
  activeModal: NgbActiveModal;
  total: number = 0;

  constructor(private api: ApiService, public storage: SessionStorageService, private actiModal: NgbActiveModal) {
    this.activeModal = actiModal;
  }

  ngOnInit(): void {
    this.carrito.forEach(e => {
      this.total += parseInt(e.precio) * parseInt(e.cantidad);
    })
  }

  listarCarrito() {
    if (this.storage.retrieve('usuario')) {
      this.api.getCarrito(this.storage.retrieve('usuario').id).subscribe((result) => {
        console.log(result)
        this.carrito = result;
        this.carrito.forEach((e, i) => {
          this.getProductoFoto(e.producto_id, i);
        });
        this.storage.store('carrito', this.carrito);
      });
    }
  }

  getProductoFoto(id: number, position: number) {
    this.api.getProductoFoto(id).subscribe(result => {
    }, error => {
      this.carrito[position].url = error.url;
    })
  }

  deleteCarrito(id: number = -1, cant: number = 0) {
    this.api.deleteCarrito(id).subscribe(result => {
      this.listarCarrito();
    }, error => this.listarCarrito())
  }
}
