import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-producto-home',
  templateUrl: './producto-home.component.html',
  styleUrls: ['./producto-home.component.css'],
  animations: [
    trigger(
      'scaleAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )]
})
export class ProductoHomeComponent implements OnInit {

  @Input() producto: Producto;
  @Input() direccion = false;
  @Input() cont = -1;
  contador: string = ''
  color: string = 'bg-osc';
  constructor(private api: ApiService, private storage: SessionStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.cont < 10) {
      this.contador = '0' + this.cont;
    }
    // console.log(this.id+'\n'+this.titulo+'\n'+this.descripcion+'\n'+this.src_producto+'\n');
    this.api.getProductoFoto(this.producto.id).subscribe((result) => {
      console.log(result);
    }, error => this.producto.imagen = error.url)
    if (this.direccion) {
      this.color = 'bg-osc';
    } else {
      this.color = 'bg-luz';
    }
  }

  verMas() {
    this.storage.store('producto', this.producto);
    this.api.getCategoriaById(this.producto.categoria).subscribe(result=>{
      this.storage.store('categoria', result);
    })
    this.router.navigate(['productos']);
  }
}
