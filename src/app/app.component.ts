import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { ApiService } from './services/api.service';

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
export class AppComponent implements OnInit {
  rate = 1;
  title = 'ICEM';
  back_class = 'navbar navbar-expand-lg navbar-dark fixed-top';
  back_oscuro = 'back-oscuro';
  back_transparente = 'back-transparent';
  back_final = '';
  loading: boolean = false;

  constructor(public storage: SessionStorageService, private api: ApiService) {

  }

  ngOnInit(): void {
    this.cargarConfigs();
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.back_final = this.back_class + ' ' + this.back_transparente;
  }

  onScrolling() {
    let btn_scroll = document.getElementById('btnScroll');
    if (document.getElementById('scroll').scrollTop <= 100) {
      this.back_final = this.back_class + ' ' + this.back_transparente;
      btn_scroll.classList.remove('btn-scala');
      btn_scroll.classList.add('btn-scala-up');
    } else {
      this.back_final = this.back_class + ' ' + this.back_oscuro;
      btn_scroll.classList.add('btn-scala');
      btn_scroll.classList.remove('btn-scala-up');
    }
  }

  onScroll(scroll: HTMLElement) {
    console.log(scroll)
    scroll.scrollIntoView({ behavior: "smooth" });
  }

  topScroll(event) {
    console.log(event);
  }

  cargarConfigs() {
    this.api.getConfiguraciones().subscribe((result) => {
      this.storage.store('carritotime', result.filter(e=>e.nombre=='carrito_time')[0])
    })
  }
}
