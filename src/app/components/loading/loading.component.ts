import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, AfterViewInit {

  @Input() loading: boolean = false;
  constructor() { }

  ngAfterViewInit(): void {
    this.loading = false;
  }

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      document.querySelector('.img').classList.toggle('active');
    }, 500)
  }
}
