import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { Noticia } from 'src/app/models/noticias';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [listAnimation, scaleAnimation]
})
export class HomeComponent implements OnInit, OnDestroy {
  productos_recientes: any = [];

  noticia: Noticia = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
    enlace: '',
    fuente: '',
    logo: '',
  };

  desarrollo: any;

  constructor(private api: ApiService, private storage: SessionStorageService, private router: Router) { }

  ngOnDestroy(): void {
    // document.getElementById("btnScroll").click();
  }

  ngOnInit(): void {
    this.cargaInicial()
    this.api.getProducto(4, -1, -1, true).subscribe((result) => {
      if (result.length > 0) {
        var direccion = false;
        var cont = 1;
        result.forEach((item) => {
          if (item.activo) {
            this.productos_recientes.push({
              id: item.id,
              titulo: item.titulo,
              descripcion: item.descripcion,
              imagen: item.imagen,
              fecha: item.fecha,
              categoria: item.categoria,
              usos: item.usos,
              especificaciones: item.especificaciones,
              garantia: item.garantia,
              precio: item.precio,
              disponibilidad: item.disponibilidad,
              direccion: direccion,
              cont: cont,
            });
            this.cargarData();
            direccion = !direccion;
            cont++;
          }
        });
      } else this.productos_recientes = [];
    });
    this.api.cargaNoticias().subscribe((result) => {
      if (result.length > 0) {
        this.noticia = result[0];
        this.noticia.logo = this.noticia.logo == '' ? 'assets/icon-icem-gray.png' : this.noticia.logo;
        // console.log(this.noticia.logo);
        result[0].imagen.includes('http') ? result[0].imagen : this.cargarImagen(result[0]);
      }
      else {
        this.noticia.titulo = '';
      }
    });
  }

  cargarImagen(e: Noticia) {
    this.noticia.imagen = environment.url_backend + `pictures/${e.id}?tipo=noticias`
  }

  verMas(item) {
    this.storage.store('noticia', item);
    this.router.navigate(['noticias/']);
  }

  cargaInicial() {
    let scroll = document.getElementById('scroll');
    let animados = document.querySelectorAll('.animado');
    scroll.addEventListener("scroll", function () {
      for (let i = 0; i < animados.length; i++) {
        let animado = <HTMLElement>animados[i]
        if ((animado.offsetTop - 600) < scroll.scrollTop) {
          animado.classList.add('activoitem');
          // console.log('scroll ', scroll.scrollTop,' animado ' , animado.offsetTop)
        }
      }

    });
  }

  cargarData() {
    // this.storage.store('producto', this.productos_recientes[0]);
    this.storage.store('categoria', { id: -1, nombre: 'Todos' });
  }

  // loadLastDevelop(){
  //   this.api.getDesarrollos().subscribe(result=>{
  //     this.desarrollo = result[0];
  //   })
  // }
}
