import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { listAnimation, scaleAnimation } from 'src/app/animations';
import { Desarrollo } from 'src/app/models/desarrollo';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-desarrollos',
  templateUrl: './desarrollos.component.html',
  styleUrls: ['./desarrollos.component.css'],
  animations: [listAnimation, scaleAnimation]
})
export class DesarrollosComponent implements OnInit {
  desarrollos: Desarrollo[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.getDesarrollos().subscribe((result) => {
      console.log(result)
      this.desarrollos = result&& result.length>0?result:[];
    }, (error) => console.log(error));
  }
}
