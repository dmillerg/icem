import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
  animations: [
    trigger('scaleAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-50%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class BusquedaComponent implements OnInit {

  busqueda: any[] = [];
  titulo: string = '';
  constructor(private storage: SessionStorageService, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (this.storage.retrieve('titulo')) {
      this.titulo = this.storage.retrieve('titulo');
    }
    this.storage.observe('titulo').subscribe((result)=>{
      if(result){
        console.log('observe',result);
        this.titulo = result;
        this.loadProductos();
      }
    })
    this.loadProductos();
  }

  loadProductos() {
   this.busqueda = [];
    this.api.searchProductos(this.titulo).subscribe(result => {
      result.result.forEach(element => {
        this.api.getProductoFoto(element.id).subscribe(result2 => console.log(result2), error => {
          this.busqueda.push({
            id: element.id,
            titulo: element.titulo,
            descripcion: element.descripcion,
            fecha: element.fecha,
            categoria: element.categoria,
            usos: element.usos,
            especificaciones: element.especificaciones,
            garantia: element.garantia,
            imagen: error.url,
            tipo: 'productos'
          });
        })

      });
      this.loadNoticias();
    });
  }

  loadNoticias() {
    this.api.searchNoticias(this.titulo).subscribe(result => {
      result.result.forEach(element => {
        this.busqueda.push({
          id: element.id,
          titulo: element.titulo,
          descripcion: element.descripcion,
          fecha: element.fecha,
          tipo: 'noticias'
        });
      });
      this.loadDesarrollos();
    });
  }

  loadDesarrollos() {
    this.api.searchDesarrollos(this.titulo).subscribe(result => {
      result.result.forEach(element => {
        this.busqueda.push({
          id: element.id,
          titulo: element.titulo,
          descripcion: element.descripcion,
          fecha: element.fecha,
          tipo: 'desarrollos'
        });
      });
      console.log(this.busqueda);
    });
  }

  verMas(item) {
    switch (item.tipo) {
      case 'productos':
        console.log('productos');
        this.storage.store('producto', item);
        this.router.navigate(['productos/']);
        break;
      case 'noticias':
        console.log('noticias');
        this.storage.store('noticia', item);
        this.router.navigate(['noticias/']);
        break;
      case 'desarrollos':
        console.log('desarrollos');
        this.storage.store('desarrollo', item);
        this.router.navigate(['nuevos/']);
        break;
    }
  }
}
