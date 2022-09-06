import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoria_pipe'
})
export class CategoriaPipe implements PipeTransform {

  transform(rows: any[], query: any): any {
    return query ? rows.filter(item => item.nombre.toLowerCase().indexOf(query.toLowerCase())>-1 || item.descripcion.toLowerCase().indexOf(query.toLowerCase())>-1) : rows;
  }

}
