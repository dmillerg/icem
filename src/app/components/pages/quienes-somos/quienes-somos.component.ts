import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Quienes } from 'src/app/models/quienes';
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
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css'],
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
export class QuienesSomosComponent implements OnInit {
  integrantes: Quienes[] = [];

  video: string = '';
  constructor(private api: ApiService, private storage: SessionStorageService) { }

  ngOnInit(): void {
    this.cargaInicial();
    this.cargaInicial2();
    this.loadQuienes();
    // this.loadVideo();
    setTimeout(()=>{
      if(this.storage.retrieve('quienes')){
        this.scrollInicial(this.storage.retrieve('quienes'));
      }
      this.storage.observe('quienes').subscribe((result)=>{
        this.scrollInicial(result);
      })
    }, 600)
  }

  loadQuienes() {
    this.api.getQuienes().subscribe((result) => {
      this.integrantes = result;
    })
  }

  loadVideo() {
    this.api.loadVideo().subscribe(
      (result) => console.log('result', result),
      (error) => (console.log(error))
    );
  }

  cargaInicial() {
    let scroll = document.getElementById('scroll');
    scroll.addEventListener("scroll", ()=> {
      this.cargaInicial2();
    });
  }

  cargaInicial2(){
    let scroll = document.getElementById('scroll');
    let animados = document.querySelectorAll('.animado');
    for (let i = 0; i < animados.length; i++) {
      let animado = <HTMLElement>animados[i]
      if (animado.offsetTop - 600 < scroll.scrollTop) {
        animado.classList.add('activoitem');
        // console.log('scroll ', scroll.scrollTop,' animado ' , animado.offsetTop)
      }
    }
  }

  scrollInicial(id: string){
    let target = document.getElementById(id);
    console.log(target);
    
    target.scrollIntoView({behavior: 'smooth'});
  }
}
