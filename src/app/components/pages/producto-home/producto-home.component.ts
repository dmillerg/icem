import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { scaleAnimation } from 'src/app/animations';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-producto-home',
  templateUrl: './producto-home.component.html',
  styleUrls: ['./producto-home.component.css'],
  animations: [scaleAnimation]
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
      this.producto.url = environment.url_backend+`pictures/${this.producto.id}?tipo=productos`;
      this.date= new Date(this.producto.fecha);
  }

  verMas(item) {
    // this.storage.clear('producto');
    this.storage.store('producto', item);
    this.emisor.emit(this.producto);
    this.router.navigate(['productos'])
  }
}
