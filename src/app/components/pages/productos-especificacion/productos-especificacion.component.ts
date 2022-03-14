import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-productos-especificacion',
  templateUrl: './productos-especificacion.component.html',
  styleUrls: ['./productos-especificacion.component.css'],
  animations: [
    trigger('scaleAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('500ms', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ProductosEspecificacionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() producto: Producto;
  @Input() id: string = '';
  @Input() oculto: boolean = false;
  @Input() categoria: string = '';
  cantidad: number = 0;

  constructor(
    private storage: SessionStorageService,
    private api: ApiService
  ) { }


  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.storage.clear('producto');
  }

  ngOnInit(): void {

  }

  cant(action: string) {
    if (action == 'more' && this.cantidad < this.producto.disponibilidad) {
      this.cantidad++;
    } else if (action == 'less' && this.cantidad > 0) {
      this.cantidad--;
    }
  }

  addCarrito(){
    let formData = new FormData();
    formData.append('user_id',this.storage.retrieve('usuario').id);
    formData.append('producto_id',this.producto.id.toString());
    formData.append('cantidad',this.cantidad.toString());
    formData.append('precio',this.producto.precio.toString());

    this.api.addCarrito(formData).subscribe((result)=>{
      console.log(result);
      this.api.getCarrito(this.storage.retrieve('usuario').id).subscribe((e)=>{
        this.storage.store('carrito', e);
      });
    });
  }
}
