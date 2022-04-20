import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Noticia } from 'src/app/models/noticias';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-noticia-item',
  templateUrl: './noticia-item.component.html',
  styleUrls: ['./noticia-item.component.css'],
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
export class NoticiaItemComponent implements OnInit {
  @Input() noticia: Noticia;
  @Output() emisor: EventEmitter<Noticia> = new EventEmitter();

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if (this.noticia.fuente == 'ICEM') {
      this.api.getNoticiaFoto(this.noticia.id).subscribe(
        (result) => { },
        (error) => {
          this.noticia.imagen = error.url;
          this.noticia.logo = 'assets/icon-icem-gray.png'
        }
      );
    }
  }

  cambiarNoticia(noticia) {
    window.open(noticia.enlace, '_blank');
  }
}
