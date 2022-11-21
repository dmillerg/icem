import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  emitter = new EventEmitter();
  constructor() { }

  emitirEvento(accion: string = '') {
    this.emitter.emit(accion);
  }
}
