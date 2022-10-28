import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelector('.img').classList.toggle('active');
    }, 500);
  }

  ngOnInit(): void {
  }
}
