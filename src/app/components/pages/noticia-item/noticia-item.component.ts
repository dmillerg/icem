import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { scaleAnimation } from 'src/app/animations';
import { Noticia } from 'src/app/models/noticias';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-noticia-item',
  templateUrl: './noticia-item.component.html',
  styleUrls: ['./noticia-item.component.css'],
  animations: [scaleAnimation],
})
export class NoticiaItemComponent implements OnInit {
  @Input() noticia: Noticia;
  @Output() emisor: EventEmitter<Noticia> = new EventEmitter();

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if (this.noticia.fuente == 'ICEM') {
          this.noticia.imagen = environment.url_backend+`pictures/${this.noticia.id}?tipo=noticias`;
          this.noticia.logo = 'assets/icon-icem-gray.png'
    }
  }

  cambiarNoticia(noticia) {
    window.open(noticia.enlace, '_blank');
  }
}
