import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Desarrollo } from 'src/app/models/desarrollo';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-desarrollo-item',
  templateUrl: './desarrollo-item.component.html',
  styleUrls: ['./desarrollo-item.component.css'],
  animations: [
    trigger(
      'scaleAnimation', [
        transition(':enter', [
          style({transform: 'scale(0)', opacity: 0}),
          animate('500ms', style({transform: 'scale(1)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'scale(1)', opacity: 1}),
          animate('500ms', style({transform: 'scale(0)', opacity: 0}))
        ])
      ]
    )]
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
    this.api.getDesarrolloFoto(this.desarrollo.id).subscribe(
      (result) => {},
      (error) => {
        this.imagen = error.url;
      }
    );
  }
}
