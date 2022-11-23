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

  loadEvento(tipo: string) {
    this.emitter.emit('load' + tipo);
  }

  notificacion(tipo: string, cant: number) {
    this.emitter.emit({ tipo: 'noti' + tipo, cant: cant });
  }
}
