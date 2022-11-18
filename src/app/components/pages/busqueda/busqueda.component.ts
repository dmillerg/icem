import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { scaleAnimation } from 'src/app/animations';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
  animations: [scaleAnimation]
})
export class BusquedaComponent implements OnInit {

  busqueda: any[] = [];
  titulo: string = '';
  constructor(private storage: SessionStorageService, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (this.storage.retrieve('titulo')) {
      this.titulo = this.storage.retrieve('titulo');
    }
    this.storage.observe('titulo').subscribe((result) => {
      if (result && result.length > 0) {
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
        
          this.busqueda.push({
            id: element.id,
            titulo: element.titulo,
            descripcion: element.descripcion,
            fecha: element.fecha,
            categoria: element.categoria,
            usos: element.usos,
            especificaciones: element.especificaciones,
            garantia: element.garantia,
            imagen: environment.url_backend+`pictures/${element.id}?tipo=productos`,
            tipo: 'productos'
          });
        })
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
          tipo: 'noticias',
          imagen: element.fuente=='ICEM'?environment.url_backend+`pictures/${element.id}?tipo=noticias`:element.imagen,
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
            imagen: environment.url_backend+`pictures/${element.id}?tipo=desarrollos`,
            tipo: 'desarrollos'
          });
        });
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
