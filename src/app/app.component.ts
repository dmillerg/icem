import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ICEM';
  back_class = 'navbar navbar-expand-lg navbar-dark fixed-top';
  back_oscuro = 'back-oscuro';
  back_transparente = 'back-transparent';
  back_final = '';

  ngOnInit(): void {
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
    scroll.scrollIntoView({behavior: "smooth"});
  }

  topScroll(event){
    console.log(event);
  }
}
