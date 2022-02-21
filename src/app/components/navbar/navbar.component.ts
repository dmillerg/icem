import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalLoginOrRegisterComponent } from '../../modals/modal-login-or-register/modal-login-or-register.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  activo: string = 'inicio';
  cont_activo = 0;
  @Input() back_class = '';
  back_classe = 'navbar navbar-expand-lg navbar-dark fixed-top';
  back_oscuro = 'back-oscuro';
  back_transparente = 'back-transparent';
  back_final = '';
  click: boolean = false;
  titulo: string = '';

  constructor(private router: Router, private storage: SessionStorageService, private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.router.url, 'asdasd');
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        console.log(e.url);
        let url_actual = e.url.substring(1, e.url.length);
        console.log(url_actual);
        if (this.activo !== url_actual) {
          document.getElementById(url_actual).classList.add('active');
          document.getElementById(this.activo).classList.remove('active');
          this.activo = url_actual;
        }
      }
    });
  }

  navigateTo(path) {
    console.log('actual', this.activo);
    console.log('nuevo', path);
    if (this.activo !== path) {
      document.getElementById(path).classList.add('active');
      document.getElementById(this.activo).classList.remove('active');
      this.activo = path;
      this.router.navigate([path + '/']);
    }
  }

  cambiarFondo() {
    if (!this.click) {
      this.back_final = this.back_class;
      if (!this.back_class.includes(this.back_oscuro)) {
        this.back_class = this.back_classe + ' ' + this.back_oscuro;
      }
      this.click = true;
    } else {
      this.back_class = this.back_final;
      this.click = false;
    }
  }

  buscar() {
    if (this.titulo.length > 0) {
      this.storage.store('titulo', this.titulo);
      this.router.navigate(['producto/']);
      this.router.navigate(['buscar/']);
    }
  }

  test() {
    let modal = this.modalService.open(ModalLoginOrRegisterComponent, { backdrop: 'static' });
    modal.result.then((result) => {
      this.storage.clear('usuario');
      const user = {
        id: result.usuario[0].id,
        usuario: result.usuario[0].usuario,
        password: result.usuario[0].password,
        nombre: result.usuario[0].nombre,
        fecha: result.usuario[0].fecha,
        token: result.token,
      };
      this.storage.store('usuario', user);
    })
  }
}
