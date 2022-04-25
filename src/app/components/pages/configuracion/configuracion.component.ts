import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Configuracion } from 'src/app/models/configuracion';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  configuraciones: Configuracion[] = [];
  configuraciones2: Configuracion[]=[]

  constructor(private api: ApiService, public storage: SessionStorageService) { }

  ngOnInit(): void {
    this.loadConfiguraciones();
  }

  loadConfiguraciones() {
    this.api.getConfiguraciones().subscribe(result => {
      console.log(result);
      this.configuraciones = result;
      this.configuraciones.forEach(e => {
        this.configuraciones2.push(e)
      });
    })
  }

  saveConfig(){
    this.storage.store('configuraciones', this.configuraciones);
  }

}
