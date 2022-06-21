import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rating-bar',
  templateUrl: './rating-bar.component.html',
  styleUrls: ['./rating-bar.component.css']
})
export class RatingBarComponent implements OnInit {

  @Input() calif: number = 0;
  @Output() emisor: EventEmitter<number> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  calificar(califi: number) {
    this.calif = califi;
    console.log(this.calif);
    this.emisor.emit(this.calif)
  }

}
