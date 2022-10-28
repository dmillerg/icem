import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalAdminComponent } from 'src/app/modals/modal-admin/modal-admin.component';
import { ModalMapaComponent } from 'src/app/modals/modal-mapa/modal-mapa.component';
import { ModalProductoComponent } from 'src/app/modals/modal-producto/modal-producto.component';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, AfterViewInit {
  btn_message: string = 'Iniciar sesión';
  usuario: string = '';
  password: string = '';
  user_auth: string = '';
  user: Usuario;
  errorAuth: boolean = false;

  autenticado: boolean = false;
  fechaAct: string = '';

  constructor(
    private modalService: NgbModal,
    private api: ApiService,
    private storage: SessionStorageService
  ) { }

  ngAfterViewInit(): void {
    this.fechaActualizacion();
  }

  ngOnInit(): void {
   
  }

  verMapa() {
    this.modalService.open(ModalMapaComponent, { size: 'lg' });
  }


  fechaActualizacion() {
    this.api.ultimaActualizacion().subscribe(result => {
      this.fechaAct = result[0].ultsession;
    });
  }

}
