import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Desarrollo } from 'src/app/models/desarrollo';
import { ApiService } from 'src/app/services/api.service';


const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ transform: 'translateY(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateY(0%)', opacity: 1  })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);

@Component({
  selector: 'app-desarrollos',
  templateUrl: './desarrollos.component.html',
  styleUrls: ['./desarrollos.component.css'],
  animations: [listAnimation,
    trigger('scaleAnimation', [
      transition(':enter', [
        style({opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class DesarrollosComponent implements OnInit {
  desarrollos: Desarrollo[];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.getDesarrollos().subscribe((result) => {
      console.log(result)
      this.desarrollos = result;
    }, (error)=> console.log(error));
  }
}
