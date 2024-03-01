import { Component, OnInit } from '@angular/core';
import { Menu } from '../model/menu.model';
import { FormGroup } from '@angular/forms';
import { CatalogoService } from '../services/catalogo.service';
import {} from 'rxjs';
import { map } from 'jquery';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  form: FormGroup;
  menu: Menu[] = [
    { codigo: 0, nombre: 'Inicio', icono: 'fa fa-home' },
    { codigo: 1, nombre: 'Productos', icono: 'fa fa-medkit' },
    { codigo: 2, nombre: 'Quienes', icono: 'fa fa-users' },
    { codigo: 3, nombre: 'Noticias', icono: 'fa fa-book-open' },
  ];

  constructor(private catalogoService: CatalogoService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.catalogoService.obtenerCategorias().subscribe({
      next: (response) => {
        console.log(response);

        this.menu[2].submenu = response.map((e) => {
          return {
            nombre: e.nombre,
            link: e.nombre,
            icono: this.menu[2].icono,
          };
        });
        console.log(this.menu[2]);
      },
    });
  }
}
