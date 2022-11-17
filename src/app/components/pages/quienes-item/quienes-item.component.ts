import { Component, Input, OnInit } from '@angular/core';
import { error } from 'protractor';
import { Quienes } from 'src/app/models/quienes';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quienes-item',
  templateUrl: './quienes-item.component.html',
  styleUrls: ['./quienes-item.component.css']
})
export class QuienesItemComponent implements OnInit {

  @Input() quienes: Quienes;
  src: string = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  this.src = environment.url_backend+`pictures/${this.quienes.id}?tipo=quienes`
  }

}
