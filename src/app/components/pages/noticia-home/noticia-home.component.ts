import { Component, OnInit, Input } from '@angular/core';
import { Noticia} from 'src/app/models/noticias';

@Component({
  selector: 'app-noticia-home',
  templateUrl: './noticia-home.component.html',
  styleUrls: ['./noticia-home.component.css']
})
export class NoticiaHomeComponent implements OnInit {
  @Input() titulo = '';
  @Input() imagen = '';
  @Input() descripcion = '';
  @Input() noticia: Noticia;

  constructor() { }

  ngOnInit(): void {
  }

}
