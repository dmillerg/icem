import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalAdminComponent } from 'src/app/modals/modal-admin/modal-admin.component';
import { ModalCarritoComponent } from 'src/app/modals/modal-carrito/modal-carrito.component';
import { Carrito } from 'src/app/models/carrito';
import { Categoria } from 'src/app/models/categoria';
import { ApiService } from 'src/app/services/api.service';
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
  acceso: string = 'acceder/registrarse';
  storage2: SessionStorageService;
  carrito: any[] = [];
  categorias: Categoria[] = [];

  total_pagar: number = 0;

  constructor(private router: Router, private storage: SessionStorageService, private modalService: NgbModal, private api: ApiService) {
    this.storage2 = storage;
  }

  ngOnInit(): void {
    if (this.storage.retrieve('carrito')) {
      this.carrito = this.storage.retrieve('carrito');
    }
    this.storage.observe('carrito').subscribe((e) => {
      this.carrito = e;
      this.total_pagar =0;
      this.carrito.forEach(i=>{
        this.total_pagar += i.cantidad*i.precio;
      })
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

  activate(url){
    if (this.activo !== url) {
      document.getElementById(url).classList.add('active');
      document.getElementById(this.activo).classList.remove('active');
      this.activo = url;
    }
  }

  navigateTo(path) {
    // console.log('actual', this.activo);
    // console.log('nuevo', path);
    if (this.activo !== path) {
      this.activate(path)
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
      console.log('buscar')
      this.router.navigate(['buscar/']);
    }
  }

  loginOrRegister(action: string) {
    let modal = this.modalService.open(ModalLoginOrRegisterComponent, { backdrop: 'static' });
    modal.componentInstance.modalAction = action;
    modal.result.then((result) => {
      this.storage.clear('usuario');
      const user = {
        id: result.usuario[0].id,
        usuario: result.usuario[0].usuario,
        password: result.usuario[0].password,
        nombre: result.usuario[0].nombre,
        fecha: result.usuario[0].fecha,
        correo: result.usuario[0].correo,
        rol: result.usuario[0].rol,
        token: result.token,
      };
      this.storage.store('usuario', user);
      this.listarCarrito();
    })
  }

  cancelarLogin() {
    this.total_pagar = 0;
    const user = this.storage.retrieve('usuario');
    if (user != undefined) {
      this.api.logout(user.id).subscribe((result) => {
        this.storage.clear('usuario');
      });
    }
  }

  administrar() {
    let modal = this.modalService.open(ModalAdminComponent, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  listarCarrito() {
    if (this.storage.retrieve('usuario')) {
      this.api.getCarrito(this.storage.retrieve('usuario').id).subscribe((result) => {
        this.carrito = result;
        this.carrito.forEach((e, i) => {
          this.total_pagar += e.precio * e.cantidad;
          this.getProductoFoto(e.producto_id, i);
        });
        this.storage.store('carrito', this.carrito);
      });
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

  pagarCarrito(){
    let modal = this.modalService.open(ModalCarritoComponent, {backdrop: 'static'})
    modal.componentInstance.carrito = this.carrito;
  }
}
