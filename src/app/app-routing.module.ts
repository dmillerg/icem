import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaComponent } from './components/pages/busqueda/busqueda.component';
import { DesarrollosComponent } from './components/pages/desarrollos/desarrollos.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NoticiasComponent } from './components/pages/noticias/noticias.component';
import { ProductosEspecificacionComponent } from './components/pages/productos-especificacion/productos-especificacion.component';
import { ProductosComponent } from './components/pages/productos/productos.component';
import { QuienesSomosComponent } from './components/pages/quienes-somos/quienes-somos.component';


const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'quienes', component: QuienesSomosComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'producto', component: ProductosEspecificacionComponent },
  { path: 'nuevos', component: DesarrollosComponent },
  { path: 'buscar', component: BusquedaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
