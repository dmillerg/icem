import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Noticia } from 'src/app/models/noticias';
import { ApiService } from 'src/app/services/api.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ transform: 'translateX(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateX(0%)', opacity: 1  })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);
@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
  animations: [listAnimation,
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
export class NoticiasComponent implements OnInit {
  noticias: Noticia[];
  noticias_all: Noticia[];
  noticiaScrap: Noticia[];
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

  image: string = '';
  constructor(private api: ApiService, private storage: SessionStorageService) { }

  ngOnInit(): void {
    // this.api.getNoticias().subscribe((result) => {
    //   try {
    //     this.noticias_all = result;
    //     if (this.storage.retrieve('noticia')) {
    //       this.noticia = this.storage.retrieve('noticia');
    //       this.noticias = result.filter(item => item.id != this.noticia.id);

    //     } else {
    //       this.noticias = result.filter(item => item != result[0]);
    //       this.noticia = result[0];
    //     }
    //     this.loadImage(this.noticia.id);
    //   } catch (e) {
    //     console.log('error noticia: ' + e)
    //   }
    // });
    this.loadNoticiasScrap();
  }

  loadNoticiasScrap(){
    this.api.cargaNoticias().subscribe((result)=>{
      console.log('scrap', result);
      this.noticiaScrap = result;
      let not: string = this.storage.retrieve('noticia').id;
      document.getElementById(not.toString()).scrollIntoView({behavior: 'smooth'});
    }) 
  }

  click(){
    let not: string = this.storage.retrieve('noticia').id;
      console.log('19560' === not);
      console.log(typeof '19560');
      console.log(typeof not.toString());
      console.log('19560' === not.toString());
      document.getElementById(not.toString()).scrollIntoView({behavior: 'smooth'});
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


  cambiarNoticia(event) {
    this.noticia = event;
    this.noticias = this.noticias_all.filter(item => item != event);
    this.loadImage(this.noticia.id);
  }
}
