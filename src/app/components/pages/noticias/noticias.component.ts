import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { Noticia } from 'src/app/models/noticias';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
  animations: [listAnimation, scaleAnimation],
})
export class NoticiasComponent implements OnInit {
  noticias: Noticia[];
  noticiaScrap: Noticia[];

  noticias_icem: Noticia[] = [];
  noticias_no_icem: Noticia[] = [];
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
  img: boolean = true;
  noticia_filtro: string = '';
  image: string = '';
  searching: boolean = false;
  constructor(private api: ApiService, private storage: SessionStorageService) { }

  ngOnInit(): void {
    this.loadNoticiasScrap();
  }

  loadNoticiasScrap() {
    this.searching = true;
    this.api.getNoticias(0, this.noticia_filtro).subscribe((result) => {
      this.noticiaScrap = Array.isArray(result)? result : []
      this.rellenarColumns();
      this.searching = false;
      if (this.storage.retrieve('noticias')) {
        let not: string = this.storage.retrieve('noticia').id;
        document.getElementById(not.toString()).scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  rellenarColumns() {
    this.noticias_icem = this.noticiaScrap.filter(e => e.fuente == 'ICEM');
    this.noticias_no_icem = this.noticiaScrap.filter(e => e.fuente != 'ICEM');
  }

  click() {
    let not: string = this.storage.retrieve('noticia').id;
    console.log('19560' === not);
    console.log(typeof '19560');
    console.log(typeof not.toString());
    console.log('19560' === not.toString());
    document.getElementById(not.toString()).scrollIntoView({ behavior: 'smooth' });
  }
  loadImage(id) {
    this.img = false;
    this.api.getNoticiaFoto(id).subscribe(
      (result) => {
      },
      (error) => {
        setTimeout(() => { this.img = true; }, 300);
        this.image = error.url;
      }
    );
  }

}
