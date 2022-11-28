import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { Quienes } from 'src/app/models/quienes';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css'],
  animations: [listAnimation,scaleAnimation],
})
export class QuienesSomosComponent implements OnInit {
  integrantes: Quienes[] = [];
  integrante: Quienes  = {
    id: -1,
    nombre: '',
    cargo: '',
    imagen: '',
    orden: 0,
  };

  video: string = '';
  constructor(private api: ApiService, private storage: SessionStorageService,config: NgbCarouselConfig ) {
    config.interval = 3000;
    config.showNavigationIndicators = true;
    config.keyboard = true;
    config.pauseOnHover = true;
   }

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
      // this.integrante = result[0];
      // this.integrantes = result.filter(e=>e.id != this.integrante.id);
      this.integrantes = result&& result.length>0?result:[]
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
