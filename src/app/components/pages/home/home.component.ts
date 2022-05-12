import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Noticia } from 'src/app/models/noticias';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ transform: 'translateX(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [listAnimation,
    trigger('scaleAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(50%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  productos_recientes: any = [];
  titulo_noti = '';
  desc_noti = '';
  img_noti = '';
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


  constructor(private api: ApiService, private storage: SessionStorageService, private router: Router) { }

  ngOnDestroy(): void {
    // document.getElementById("btnScroll").click();
  }

  ngOnInit(): void {
    this.cargaInicial()
    this.api.getProducto(4).subscribe((result) => {
      if (result.length > 0) {
        var direccion = false;
        var cont = 1;
        result.forEach((item) => {
          if(item.activo){
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
          cont++;}
        });
      } else this.productos_recientes = [];
    });
    this.api.cargaNoticias().subscribe((result) => {
      if (result.length > 0) {
        this.titulo_noti = result[0].titulo;
        this.desc_noti = result[0].descripcion;
        this.noticia = result[0];
        this.noticia.logo = this.noticia.logo==null?'assets/icon-icem-gray.png':this.noticia.logo;
        result[0].imagen.includes('http') ?result[0].imagen : this.cargarImagen(result[0]);
      }
    });
  }

  cargarImagen(e: Noticia){
    this.api.getNoticiaFoto(e.id).subscribe((result) => { }, error => {
      this.img_noti = error.url;
    });
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
    this.storage.store('producto', this.productos_recientes[0]);
    this.storage.store('categoria', { id: -1, nombre: 'Todos' });
  }
}
