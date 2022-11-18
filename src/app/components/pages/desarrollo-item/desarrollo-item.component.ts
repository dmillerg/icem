import { Component, Input, OnInit } from '@angular/core';
import { scaleAnimation } from 'src/app/animations';
import { Desarrollo } from 'src/app/models/desarrollo';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-desarrollo-item',
  templateUrl: './desarrollo-item.component.html',
  styleUrls: ['./desarrollo-item.component.css'],
  animations: [scaleAnimation]
})
export class DesarrolloItemComponent implements OnInit {
  @Input() desarrollo: Desarrollo;
  imagen: string = '';
  id: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    if (this.desarrollo.id[0] != '0' && this.desarrollo.id < 10) {
      this.id = '0' + this.desarrollo.id;
    } else this.id = this.desarrollo.id.toString();
    this.imagen = environment.url_backend+`pictures/${this.desarrollo.id}?tipo=desarrollos`;
  }
}
