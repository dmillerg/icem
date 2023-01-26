import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-table',
  templateUrl: './loading-table.component.html',
  styleUrls: ['./loading-table.component.css']
})
export class LoadingTableComponent implements OnInit {

  @Input() mensaje: string ='cargando...'
  constructor() { }

  ngOnInit(): void {
  }

}
