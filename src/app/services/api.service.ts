import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { Producto } from '../models/producto';
import { Categoria } from '../models/categoria';
import { Noticia } from '../models/noticias';
import { Desarrollo } from '../models/desarrollo';
import { Usuario } from '../models/usuario';
import { Login } from '../models/login';
import { Chat } from '../models/chat';
import { Buscar } from '../models/buscar';
import { Quienes } from '../models/quienes';
import { Scrap } from '../models/scrap';
import { Posts } from '../models/posts';
import { Respuesta } from '../models/respuesta';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // url: string = 'http://9d6d-152-207-246-165.ngrok.io/apis/';
  url: string = 'http://localhost:9706/apis/';

  constructor(
    private http: HttpClient,
    private storage: SessionStorageService
  ) {
  }

  /**
   * Obtener los productos en base de datos
   * @param limit cantidad de productos a devolver
   * @returns
   */
  getProducto(
    limit: number = 0,
    categoria: number = -1,
    excluir: number = -1
  ): Observable<Producto[]> {
    const headers = { 'content-type': 'application/json' };
    const params = {
      categoria: categoria,
      excluir: excluir,
    };
    let direccion = this.url + 'productos/' + limit.toString();
    return this.http.get<Producto[]>(direccion, {
      headers: headers,
      params: params,
    });
  }

  /**
   * Actualiza el producto
   * @param formData datos actualizados del producto
   * @param id id del producto a actualizar
   * @returns
   */
  updateProducto(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'productos/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda un nuevo producto
   * @param formData datos del producto
   * @returns
   */
  addProducto(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveProducto';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina un producto
   * @param id producto a eliminar
   * @returns
   */
  deleteProducto(id) {
    let direccion = this.url + 'deleteProducto/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtener foto de un producto
   * @param id id del producto
   * @returns
   */
  getProductoFoto(id) {
    let direccion = this.url + 'productoFoto/' + id.toString();
    return this.http.get(direccion);
  }

  /**
   * Obtener las categorias de un producto
   * @returns
   */
  getCategorias(): Observable<Categoria[]> {
    let direccion = this.url + 'categorias/';
    return this.http.get<Categoria[]>(direccion);
  }

  /**
   * Obtener la categoria por su id
   * @param id de la categoria
   * @returns
   */
  getCategoriaById(id: number = -1): Observable<Categoria> {
    let direccion = this.url + 'categoria/' + id.toString();
    return this.http.get<Categoria>(direccion);
  }

  /**
   * Actualiza la categoria
   * @param formData datos actualizados de la categoria
   * @param id id de la categoria a actualizar
   * @returns
   */
  updateCategoria(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'categorias/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda una nueva categoria
   * @param formData datos de la categoria
   * @returns
   */
  addCategoria(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveCategoria';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina una categoria
   * @param id categoria a eliminar
   * @returns
   */
  deleteCategoria(id) {
    let direccion = this.url + 'deleteCategoria/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtener las noticias en base de datos
   * @param limit cantidad de noticias a devolver
   * @returns
   */
  getNoticias(limit: number = 0): Observable<Noticia[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'noticias/' + limit.toString();
    return this.http.get<Noticia[]>(direccion, { headers: headers });
  }

  /**
   * Actualiza la noticia
   * @param formData datos actualizados de la noticia
   * @param id id de la noticia a actualizar
   * @returns
   */
  updateNoticia(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'noticias/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda una nueva noticia
   * @param formData datos de la noticia
   * @returns
   */
  addNoticia(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveNoticia';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina una noticia
   * @param id noticia a eliminar
   * @returns
   */
  deleteNoticia(id) {
    let direccion = this.url + 'deleteNoticia/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtener foto de una noticia
   * @param id id de la noticia
   * @returns
   */
  getNoticiaFoto(id) {
    let direccion = this.url + 'noticiaFoto/' + id.toString();
    return this.http.get(direccion);
  }

  /**
   * Obtener los desarrollos en base de datos
   * @param limit cantidad de desarrollos a devolver
   * @returns
   */
  getDesarrollos(limit: number = 0): Observable<Desarrollo[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'desarrollos/' + limit.toString();
    return this.http.get<Desarrollo[]>(direccion, { headers: headers });
  }

  /**
   * Actualiza el desarrollo
   * @param formData datos actualizados del desarrollo
   * @param id id del desarrollo a actualizar
   * @returns
   */
  updateDesarrollo(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'desarrollos/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda una nuevo desarrollo
   * @param formData datos del desarrollo
   * @returns
   */
  addDesarrollos(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveDesarrollo';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina un desarrollo
   * @param id desarrollo a eliminar
   * @returns
   */
  deleteDesarrollo(id) {
    let direccion = this.url + 'deleteDesarrollo/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtener foto de un desarrollo
   * @param id id del desarrollo
   * @returns
   */
  getDesarrolloFoto(id) {
    let direccion = this.url + 'desarrolloFoto/' + id.toString();
    return this.http.get(direccion);
  }

  /**
   * Loguea a un usuario
   * @param formData usuario y contraseña del usuario que se intenta autenticar
   * @returns
   */
  login(formData): Observable<Login> {
    let direccion = this.url + 'login';
    return this.http.post<Login>(direccion, formData);
  }

  /**
   * desloguea a un usuario
   * @param id de usuario que se desautentica
   * @returns
   */
  logout(id: number = -1) {
    let direccion = this.url + 'logout/' + id.toString();
    return this.http.post(direccion, {});
  }

  /**
   * Obtener los usuarios en base de datos
   * @param limit cantidad de usuarios a devolver
   * @returns
   */
  getUsuarios(limit: number = 0): Observable<Usuario[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'usuarios/' + limit.toString();
    return this.http.get<Usuario[]>(direccion, { headers: headers });
  }

  /**
   * Actualiza el usuarios
   * @param formData datos actualizados del usuarios
   * @param id id del usuarios a actualizar
   * @returns
   */
  updateUsuario(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'usuarios/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda una nuevo usuarios
   * @param formData datos del usuarios
   * @returns
   */
  addUsuarios(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveUsuario';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina un usuario
   * @param id usuario a eliminar
   * @returns
   */
  deleteUsuarios(id) {
    let direccion = this.url + 'deleteUsuario/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtener los chats en base de datos
   * @param id de ultimo chat
   * @returns
   */
  getChats(id: number = 0): Observable<Chat[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'chats/' + id.toString();
    return this.http.get<Chat[]>(direccion, { headers: headers });
  }

  /**
   * Actualiza el chat
   * @param formData datos actualizados del chat
   * @param id id del chat a actualizar
   * @returns
   */
  updateChat(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'chat/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda una nuevo chat
   * @param formData datos del chat
   * @returns
   */
  addChat(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveChat';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina un chat
   * @param id chat a eliminar
   * @returns
   */
  deleteChat(id: number = -1) {
    let direccion = this.url + 'deleteChat/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtiene la foto del chat
   * @param id chat en la db
   * @returns
   */
  getChatFoto(id) {
    let direccion = this.url + 'chatFoto/' + id.toString();
    return this.http.get(direccion);
  }

  /**
   * Obtiene la foto para descargar
   * @param nombre nombre del foto
   * @returns
   */
  downloadFoto(nombre) {
    let direccion = this.url + 'download';
    const headers = { 'content-type': 'application/json' };
    const params = {
      nombre: nombre,
    };
    return this.http.get(direccion, { headers: headers, params: params });
  }

  /**
   * Busca por un titulo los productos
   * @param titulo del producto a buscar
   * @returns
   */
  searchProductos(titulo): Observable<Buscar> {
    let direccion = this.url + 'searchProductos/' + titulo;
    const headers = { 'content-type': 'application/json' };
    return this.http.get<Buscar>(direccion);
  }

  /**
   * Busca por un titulo las noticias
   * @param titulo de la noticias a buscar
   * @returns
   */
  searchNoticias(titulo): Observable<Buscar> {
    let direccion = this.url + 'searchNoticias/' + titulo;
    const headers = { 'content-type': 'application/json' };
    return this.http.get<Buscar>(direccion);
  }

  /**
   * Busca por un titulo los desarrollos
   * @param titulo del desarrollo a buscar
   * @returns
   */
  searchDesarrollos(titulo): Observable<Buscar> {
    let direccion = this.url + 'searchDesarrollos/' + titulo;
    const headers = { 'content-type': 'application/json' };
    return this.http.get<Buscar>(direccion);
  }

  /**
   * Obtiene la url del video
   * @returns
   */
  loadVideo() {
    let direccion = this.url + 'loadVideo';
    return this.http.get(direccion);
  }

  /**
   * Realiza cualquier tipo de consulta a la db
   * @param query consulta sql
   * @returns
   */
  all(query: string = '') {
    let direccion = this.url + 'all';
    return this.http.post(direccion, {
      query: query,
      token: this.storage.retrieve('usuario').token,
    });
  }

  /**
   * Obtener noticias de scrapping
   * @returns 
   */
  cargaNoticias(): Observable<any[]> {
    let direccion = this.url + 'scrapping';
    return this.http.get<any[]>(direccion);
  }

  /**
   * Obtener las personas en base de datos
   * @param limit cantidad de personas a devolver
   * @returns
   */
  getQuienes(limit: number = 0): Observable<Quienes[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'quienes/' + limit.toString();
    return this.http.get<Quienes[]>(direccion, { headers: headers });
  }

  /**
   * Actualiza la persona
   * @param formData datos actualizados de la persona
   * @param id id de la persona a actualizar
   * @returns
   */
  updateQuienes(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'quienes/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda una nueva persona
   * @param formData datos de la persona
   * @returns
   */
  addQuienes(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveQuienes';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina una persona
   * @param id persona a eliminar
   * @returns
   */
  deleteQuienes(id: number = -1) {
    let direccion = this.url + 'deleteQuienes/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtiene la foto de la persona
   * @param id persona en la db
   * @returns
   */
  getQuienesFoto(id) {
    let direccion = this.url + 'quienFoto/' + id.toString();
    return this.http.get(direccion);
  }

  /**
   * Obtener los scraps en base de datos
   * @param limit cantidad de scraps a devolver
   * @returns
   */
  getScraps(limit: number = 0): Observable<Scrap[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'scrap/' + limit.toString();
    return this.http.get<Scrap[]>(direccion, { headers: headers });
  }

  /**
   * Actualiza el scrap
   * @param formData datos actualizados del scrap
   * @param id id del scrap a actualizar
   * @returns
   */
  updateScrap(formData, id) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'scrap/' + id;
    return this.http.post(direccion, formData);
  }

  /**
   * Guarda una nuevo scrap
   * @param formData datos del scrap
   * @returns
   */
  addScrap(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveScrap';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina un scrap
   * @param id scrap a eliminar
   * @returns
   */
  deleteScrap(id: number = -1) {
    let direccion = this.url + 'deleteScrap/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtener los posts en base de datos
   * @param id_producto cantidad de posts a devolver
   * @returns
   */
  getPosts(id_producto: number = -1): Observable<Posts[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'posts/' + id_producto.toString();
    return this.http.get<Posts[]>(direccion, { headers: headers });
  }

  /**
   * Guarda una nuevo post
   * @param formData datos del post
   * @returns
   */
  addPosts(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'savePosts';
    return this.http.post(direccion, formData);
  }

  /**
  * Elimina un posts
  * @param id posts a eliminar
  * @returns
  */
  deletePosts(id: number = -1) {
    let direccion = this.url + 'deletePosts/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
* Obtener las respuestas en base de datos
* @param id_post cantidad de respuesta a devolver
* @returns
*/
  getRespuestas(id_post: number = -1): Observable<Respuesta[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'respuesta/' + id_post.toString();
    return this.http.get<Respuesta[]>(direccion, { headers: headers });
  }

  /**
   * Guarda una nueva respuesta
   * @param formData datos de la respuesta
   * @returns
   */
  addRespuesta(formData) {
    const headers = { 'content-type': 'application/json' };
    formData.append('token', this.storage.retrieve('usuario').token);
    let direccion = this.url + 'saveRespuesta';
    return this.http.post(direccion, formData);
  }

  /**
  * Elimina una respuesta
  * @param id respuesta a eliminar
  * @returns
  */
  deleteRespuesta(id: number = -1) {
    let direccion = this.url + 'deleteRespuesta/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    const params = {
      token: this.storage.retrieve('usuario').token,
    };
    return this.http.delete(direccion, { headers: headers, params: params });
  }

  /**
   * Obtiene todas las respuestas de un post
   * @param id post a obtener respuestas
   * @returns
   */
  respuestasByPost(idpost: number = -1): Observable<any[]> {
    let direccion = this.url + 'respbypost/' + idpost.toString();
    const headers = { 'content-type': 'application/json' };
    return this.http.get<any[]>(direccion);
  }

  /**
  * Prueba un scrap para ver si devuelve correctamente
  * @param id scrap a probar
  * @returns
  */
  probarScrap(id: number = -1, formData: FormData) {
    let direccion = this.url + 'probarScrap/' + id.toString();
    formData.append('token', this.storage.retrieve('usuario').token);
    const headers = { 'content-type': 'application/json' };
    return this.http.post(direccion, formData);
  }
}