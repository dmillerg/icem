import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 }))
      ])
    ]
    )]
})
export class ProductoHomeComponent implements OnInit {
  @Input() producto;
  @Output() emisor: EventEmitter<Producto> = new EventEmitter();
  id: string = '';
  today: Date = new Date();
  date: Date = new Date();

  constructor(
    private api: ApiService,
    public storage: SessionStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.producto.id < 10 && this.producto.id.toString()[0] != '0') {
      this.id = '0' + this.producto.id;
    } else this.id = this.producto.id.toString();
    this.api.getProductoFotoName(this.producto.imagen.split(',')[0]).subscribe(
      (result) => {
        console.log(result, this.today, this.producto.fecha, this.today==this.producto.fecha);
      },
      (error) => {
        this.producto.url = error.url;
        this.date= new Date(this.producto.fecha);
      }
    );
  }

  verMas(item) {
    // this.storage.clear('producto');
    this.storage.store('producto', item);
    this.emisor.emit(this.producto);
    this.router.navigate(['productos'])
  }
}
