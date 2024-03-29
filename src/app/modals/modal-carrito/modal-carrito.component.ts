import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Carrito } from 'src/app/models/carrito';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

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
    // this.loadCarrito();
    this.listarCarrito();
   this.calcularTotal();
  }

  loadCarrito(){
    if(this.carrito.length==0){
      if(this.storage.retrieve('usuario') && this.storage.retrieve('carrito') && this.storage.retrieve('carrito').length>0){
        this.carrito = this.storage.retrieve('carrito');
      }
    }
  }

  calcularTotal(){
    this.total = 0;
    this.carrito.forEach(e => {
      this.total += parseInt(e.precio) * parseInt(e.cantidad);
    });
  }

  listarCarrito() {
    if (this.storage.retrieve('usuario')) {
      this.api.getCarrito(this.storage.retrieve('usuario').id).subscribe((result) => {
        console.log(result)
        this.carrito = result;
        this.carrito.forEach((e, i) => {
          this.getProductoFoto(e.producto_id, i);
        });
        this.calcularTotal();
        this.storage.store('carrito', this.carrito);
      });
    }
  }

  getProductoFoto(id: number, position: number) {
    
    this.carrito[position].url=environment.url_backend+`pictures/${id}?tipo=productos`
  }

  deleteCarrito(id: number = -1, cant: number = 0) {
    this.api.deleteCarrito(id).subscribe(result => {
      this.listarCarrito();
    }, error => this.listarCarrito())
  }

  reservar() {
    
    this.carrito.forEach((item, i) => {
      
      let formData = new FormData();
      formData.append('user_id', item.user_id.toString());
      formData.append('producto_id', item.producto_id.toString());
      formData.append('cantidad', item.cantidad.toString());
      formData.append('estado', 'reservado');
      formData.append('id_carrito', item.id);
      this.api.addPedido(formData).subscribe((result) => {
        
        if (i+1 == this.carrito.length) {
          this.carrito = [];
          this.storage.store('carrito',this.carrito)
          this.activeModal.close();
        }
      }, error=>{
        console.log(error);
        
      })
    })
  }
}
