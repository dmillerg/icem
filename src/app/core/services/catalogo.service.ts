import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../model/categoria.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  url: string = environment.url_backend + 'apis/';

  constructor(
    private http: HttpClient,
    private storage: SessionStorageService
  ) {}

  obtenerCategorias(): Observable<Categoria[]> {
    let direccion = this.url + 'categorias/';
    return this.http.get<Categoria[]>(direccion);
  }
}
