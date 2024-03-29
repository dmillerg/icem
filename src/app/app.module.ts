import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import localEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localEs, 'es');

import { AppRoutingModule } from './app-routing.module';
// import { NgMap } from 'ngmap';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HomeComponent } from './components/pages/home/home.component';
import { ProductoComponent } from './components/pages/producto/producto.component';
import { MenuInicioComponent } from './components/pages/menu-inicio/menu-inicio.component';
import { ProductoHomeComponent } from './components/pages/producto-home/producto-home.component';
import { NoticiaHomeComponent } from './components/pages/noticia-home/noticia-home.component';
import { QuienesSomosComponent } from './components/pages/quienes-somos/quienes-somos.component';
import { QuienesItemComponent } from './components/pages/quienes-item/quienes-item.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalMapaComponent } from './modals/modal-mapa/modal-mapa.component';
import { ModalProductoComponent } from './modals/modal-producto/modal-producto.component';
import { FormsModule } from '@angular/forms';
import { DesarrollosComponent } from './components/pages/desarrollos/desarrollos.component';
import { DesarrolloItemComponent } from './components/pages/desarrollo-item/desarrollo-item.component';
import { ModalAdminComponent } from './modals/modal-admin/modal-admin.component';
import { TableProductoComponent } from './components/tables/table-producto/table-producto.component';
import { TableCategoriaComponent } from './components/tables/table-categoria/table-categoria.component';
import { TableNoticiaComponent } from './components/tables/table-noticia/table-noticia.component';
import { TableDesarrolloComponent } from './components/tables/table-desarrollo/table-desarrollo.component';
import { ModalDeleteComponent } from './modals/modal-delete/modal-delete.component';
import { ModalCategoriaComponent } from './modals/modal-categoria/modal-categoria.component';
import { ModalNoticiaComponent } from './modals/modal-noticia/modal-noticia.component';
import { ModalDesarrolloComponent } from './modals/modal-desarrollo/modal-desarrollo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalUsuarioComponent } from './modals/modal-usuario/modal-usuario.component';
import { TableUsuarioComponent } from './components/tables/table-usuario/table-usuario.component';
import { NoticiasComponent } from './components/pages/noticias/noticias.component';
import { NoticiaItemComponent } from './components/pages/noticia-item/noticia-item.component';
import { BusquedaComponent } from './components/pages/busqueda/busqueda.component';
import { ModalQuienesComponent } from './modals/modal-quienes/modal-quienes.component';
import { TableQuienesComponent } from './components/tables/table-quienes/table-quienes.component';
import { ModalScrapComponent } from './modals/modal-scrap/modal-scrap.component';
import { TableScrapComponent } from './components/tables/table-scrap/table-scrap.component';
import { ModalPostsComponent } from './modals/modal-posts/modal-posts.component';
import { TablePostsComponent } from './components/tables/table-posts/table-posts.component';
import { ModalRespuestaComponent } from './modals/modal-respuesta/modal-respuesta.component';
import { ModalScrapPruebaComponent } from './modals/modal-scrap-prueba/modal-scrap-prueba.component';
import { ModalLoginOrRegisterComponent } from './modals/modal-login-or-register/modal-login-or-register.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalCarritoComponent } from './modals/modal-carrito/modal-carrito.component';
import { TablePedidoComponent } from './components/tables/table-pedido/table-pedido.component';
import { ModalAdminResetComponent } from './modals/modal-admin-reset/modal-admin-reset.component';
import { ModalPerfilComponent } from './modals/modal-perfil/modal-perfil.component';
import { ConfiguracionComponent } from './components/pages/configuracion/configuracion.component';
import { ModalConfiguracionComponent } from './modals/modal-configuracion/modal-configuracion.component';
import { TableConfiguracion } from './components/tables/table-configuracion/table-configuracion.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ModalActivationComponent } from './modals/modal-activation/modal-activation.component';
import { ModalUserResetPasswordComponent } from './modals/modal-user-reset-password/modal-user-reset-password.component';
import { ModalEstadoPedidoComponent } from './modals/modal-estado-pedido/modal-estado-pedido.component';
import { TableVentasComponent } from './components/tables/table-ventas/table-ventas.component';
import { ProductosComponent } from './components/pages/productos/productos.component';
import { PostsComponent } from './components/pages/posts/posts.component';
import { ProductoEspecificationComponent } from './components/pages/producto-especification/producto-especification.component';
import { RatingBarComponent } from './components/rating-bar/rating-bar.component';
import { ContactenosComponent } from './components/pages/contactenos/contactenos.component';
import { TableMensajesComponent } from './components/tables/table-mensajes/table-mensajes.component';
import { ModalMensajeComponent } from './modals/modal-mensaje/modal-mensaje.component';
import { UserActivePipe, UserPipe } from './pipes/usuario/userfilter.pipe';
import { FechaPipe } from './pipes/fecha/fecha.pipe';
import { ProductoCategoriaPipe } from './pipes/producto/producto.pipe';
import { AllPipe } from './pipes/tablefilter/allfilter.pipe';
import { NoticiaFuentePipe } from './pipes/noticia/noticia.pipe';
import { DesarrolloTituloPipe } from './pipes/desarrollo/desarrollo.pipe';
import { PostsCorreoPipe, PostsUsuarioPipe, PostsVistoPipe } from './pipes/posts/posts.pipe';
import { CategoriaPipe } from './pipes/categoria/categoria.pipe';
import { LoadingTableComponent } from './components/loading-table/loading-table.component';
import { CoreModule } from './core/core.module';
// import { AngularOpenlayersModule } from "ngx-openlayers";
// import { AngularCesiumModule, AngularCesiumWidgetsModule } from '@angular-cesium';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ProductoComponent,
    MenuInicioComponent,
    ProductoHomeComponent,
    NoticiaHomeComponent,
    QuienesSomosComponent,
    QuienesItemComponent,
    ModalMapaComponent,
    ModalProductoComponent,
    ModalAdminComponent,
    ModalPostsComponent,
    ModalRespuestaComponent,
    DesarrollosComponent,
    DesarrolloItemComponent,
    TableProductoComponent,
    TableCategoriaComponent,
    TableNoticiaComponent,
    TableDesarrolloComponent,
    TableUsuarioComponent,
    TableQuienesComponent,
    TableScrapComponent,
    TablePostsComponent,
    TablePedidoComponent,
    TableConfiguracion,
    TableMensajesComponent,
    TableVentasComponent,
    ModalDeleteComponent,
    ModalCategoriaComponent,
    ModalNoticiaComponent,
    ModalDesarrolloComponent,
    ModalUsuarioComponent,
    ModalQuienesComponent,
    ModalScrapComponent,
    ModalScrapPruebaComponent,
    NoticiasComponent,
    NoticiaItemComponent,
    BusquedaComponent,
    ModalLoginOrRegisterComponent,
    LoadingComponent,
    ModalCarritoComponent,
    ModalAdminResetComponent,
    ModalPerfilComponent,
    ConfiguracionComponent,
    ModalConfiguracionComponent,
    LoadingSpinnerComponent,
    ModalActivationComponent,
    ModalUserResetPasswordComponent,
    ModalEstadoPedidoComponent,
    ModalMensajeComponent,
    ProductosComponent,
    PostsComponent,
    ProductoEspecificationComponent,
    RatingBarComponent,
    ContactenosComponent,
    UserPipe,
    UserActivePipe,
    FechaPipe,
    ProductoCategoriaPipe,
    AllPipe,
    NoticiaFuentePipe,
    DesarrolloTituloPipe,
    PostsUsuarioPipe,
    PostsCorreoPipe,
    PostsVistoPipe,
    CategoriaPipe,
    LoadingTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    NgbModule,
    FormsModule,
    CoreModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
