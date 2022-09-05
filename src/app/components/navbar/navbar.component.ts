import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { ModalAdminComponent } from 'src/app/modals/modal-admin/modal-admin.component';
import { ModalCarritoComponent } from 'src/app/modals/modal-carrito/modal-carrito.component';
import { ModalPerfilComponent } from 'src/app/modals/modal-perfil/modal-perfil.component';
import { Carrito } from 'src/app/models/carrito';
import { Categoria } from 'src/app/models/categoria';
import { ApiService } from 'src/app/services/api.service';
import { ModalLoginOrRegisterComponent } from '../../modals/modal-login-or-register/modal-login-or-register.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  activo: string = 'inicio';
  cont_activo = 0;
  @Input() back_class = '';
  back_classe = 'navbar navbar-expand-lg navbar-dark fixed-top';
  back_oscuro = 'back-oscuro';
  back_transparente = 'back-transparent';
  back_final = '';
  click: boolean = false;
  titulo: string = '';
  acceso: string = 'acceder/registrarse';
  storage2: SessionStorageService;
  carrito: any[] = [];
  categorias: Categoria[] = [];
  tiempo: any = {
    hora: '00',
    minuto: '00',
    segundo: '00'
  }
  intervalo: any = undefined;
  timeConfig: number = 0;

  searched: boolean = false;

  total_pagar: number = 0;

  constructor(private router: Router,
    private storage: SessionStorageService,
    private localstorage: LocalStorageService,
    private modalService: NgbModal,
    private api: ApiService) {
    this.storage2 = storage;
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalo);
    this.intervalo = undefined;
  }

  ngOnInit(): void {
    if (this.storage.retrieve('configuraciones')) {
      let result = this.storage.retrieve('configuraciones');
      this.timeConfig = Number(result.filter(e => e.nombre = "carrito_time")[0].config)
    }
    this.storage.observe('configuraciones').subscribe((result) => {
      if (result && result.length > 0) {
        this.timeConfig = Number(result.filter(e => e.nombre = "carrito_time")[0].config);
        // this.cargarTiempoRestante();
      }
    })
    if (this.storage.retrieve('carrito')) {
      this.carrito = this.storage.retrieve('carrito');
    }
    this.storage.observe('carrito').subscribe((e) => {
      if (e.length > 0) {
        this.carrito = e;
        this.total_pagar = 0;
        this.carrito.forEach(i => {
          this.total_pagar += i.cantidad * i.precio;
        });
        this.total_pagar = Math.round(this.total_pagar * 100)/100;
        this.cargarTiempoRestante();
      }else{
        this.carrito = []
      }
    });
    this.listarCategoriasProductos();
    this.listarCarrito();
    if (this.storage.retrieve('usuario')) {
      this.acceso = this.storage.retrieve('usuario').nombre;
    }
    this.storage.observe('usuario').subscribe((e) => {
      if (e != undefined) {
        this.acceso = e.nombre;
      } else this.acceso = 'acceder/registrarse';
    })
    console.log(this.router.url, 'asdasd');
    this.activate(this.router.url.substring(1, this.router.url.length))
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        console.log(e.url);
        let url_actual = e.url.substring(1, e.url.length);
        console.log(url_actual);
        this.activate(url_actual)
      }
    });
  }

  activate(url) {
    if (this.activo !== url) {
      if (document.getElementById(url)) document.getElementById(url).classList.add('active');
      if (document.getElementById(this.activo)) document.getElementById(this.activo).classList.remove('active');
      this.activo = url;
    }

  }

  navigateTo(path) {
    if (this.activo !== path) {
      if (path == 'productos') {
        if (!this.storage.retrieve('categoria')) {
          this.storage.store('categoria', { id: -1, nombre: 'Todos' });
        }
      }
      if (path != 'buscar') {
        this.activate(path);
      }
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

  cargarTiempoRestante() {
    console.log('TIEMPO RESTANTE');

    clearInterval(this.intervalo);
    this.intervalo = undefined;
    if (this.carrito.length > 0 && this.intervalo == undefined) {
      let date = new Date(Date.parse(this.carrito[0].fecha));
      let fecha: string = date.getFullYear().toString() + '-' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString() + '-' + ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()).toString()
      let hora: string = ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours()).toString() + ':' + ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()).toString() + ':' + ((date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()).toString()
      let formData = new FormData();
      formData.append('fecha', fecha + ' ' + hora)
      // console.log(this.timeConfig);

      let horas = this.timeConfig
      this.api.getTiempoRestanteCarrito(formData).subscribe((result) => {
        this.tiempo.hora = Math.floor(Math.floor(horas - (result.tiempo / 3600)))
        this.tiempo.minuto = Math.floor(((horas - (result.tiempo / 3600)) - Math.floor(horas - (result.tiempo / 3600))) * 60)
        this.tiempo.segundo = Math.floor(((horas - (result.tiempo / 3600)) - Math.floor(horas - (result.tiempo / 3600))) * 3600) % 60
        console.log(this.tiempo);

        this.intervalo = setInterval(() => {
          this.disminuirSec()
        }, 1000)
      })
    }
  }

  disminuirSec() {
    if (this.tiempo.hora == 0 && this.tiempo.minuto == 0 && this.tiempo.segundo == 0) {
      clearInterval(this.intervalo);
      this.deleteCarritoTime();
    } else {
      if (this.tiempo.segundo == 0) {
        this.tiempo.segundo = 59;
        this.disminuirMin();
      } else {
        this.tiempo.segundo--;
      }
    }
  }

  disminuirMin() {
    if (this.tiempo.minuto == 0) {
      this.tiempo.minuto = 59;
      this.disminuirHr();
    } else {
      this.tiempo.minuto--;
    }
  }

  disminuirHr() {
    if (this.tiempo.hora > 0) {
      this.tiempo.hora--;
    }
  }

  buscar() {
    if (this.titulo.length > 0) {
      this.storage.store('titulo', this.titulo);
      console.log('buscar')
      this.router.navigate(['buscar/']);
    }
  }

  loginOrRegister(action: string) {
    let modal = this.modalService.open(ModalLoginOrRegisterComponent, { backdrop: 'static' });
    modal.componentInstance.modalAction = action;
    modal.result.then((result) => {
      if (result) {
        this.storage.clear('usuario');
        const user = {
          id: result.usuario[0].id,
          usuario: result.usuario[0].usuario,
          password: result.usuario[0].password,
          nombre: result.usuario[0].nombre,
          fecha: result.usuario[0].fecha,
          correo: result.usuario[0].correo,
          pais: result.usuario[0].pais,
          direccion: result.usuario[0].direccion,
          telefono: result.usuario[0].telefono,
          rol: result.usuario[0].rol,
          token: result.token,
        };
        this.storage.store('usuario', user);
        this.listarCarrito();
      }
    })
  }

  cancelarLogin() {
    this.total_pagar = 0;
    const user = this.storage.retrieve('usuario');
    if (user != undefined) {
      this.api.logout(user.id).subscribe((result) => {
        this.storage.clear('usuario');
        this.localstorage.clear('usuario');
      });
    }
  }

  administrar() {
    let modal = this.modalService.open(ModalAdminComponent, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  perfil() {
    let modal = this.modalService.open(ModalPerfilComponent, {
      size: 'lg',
      backdrop: 'static'
    })
  }

  listarCarrito() {
    if (this.storage.retrieve('usuario')) {
      this.api.getCarrito(this.storage.retrieve('usuario').id).subscribe((result) => {
        this.carrito = result;
        this.carrito.forEach((e, i) => {
          this.total_pagar += e.precio * e.cantidad;
          this.getProductoFoto(e.producto_id, i);
        });
      });
    }
    this.storage.store('carrito', this.carrito);
    if (this.carrito.length > 0) {
      console.log('entro');
      // this.cargarTiempoRestante();
    }
  }

  getProductoFoto(id: number, position: number) {
    this.api.getProductoFoto(id).subscribe(result => {
    }, error => {
      this.carrito[position].url = error.url;
    })
  }

  listarCategoriasProductos() {
    this.api.getCategorias().subscribe((result) => {
      this.categorias = result;
    });
  }

  loadProducto(item) {
    console.log(item);

    this.storage.store('categoria', item);
  }

  loadQuienes(item) {
    this.storage.store('quienes', item);
  }

  deleteCarrito(id: number = -1, cant: number = 0) {
    this.api.deleteCarrito(id).subscribe(result => {
      this.listarCarrito();
    }, error => this.listarCarrito())
  }

  pagarCarrito() {
    let modal = this.modalService.open(ModalCarritoComponent, { backdrop: 'static' })
    modal.componentInstance.carrito = this.carrito;
  }

  deleteCarritoTime() {
    let carLen = this.carrito.length - 1;
    this.carrito.forEach((e, i) => {
      this.api.deleteCarrito(e.id).subscribe((result) => {
        if (i == carLen) {
          this.listarCarrito();
        }
      })
    })
  }

  calcularWindowWidthSize() {
    return window.innerWidth < 854;
  }

  calcularWindowHeightSize() {
    return window.innerHeight < 478;
  }

  openChat(){
    document.querySelector('.chat-fixed-position').classList.toggle('closed');
  }
}
