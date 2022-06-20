import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating-bar',
  templateUrl: './rating-bar.component.html',
  styleUrls: ['./rating-bar.component.css']
})
export class RatingBarComponent implements OnInit {

  calif: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
