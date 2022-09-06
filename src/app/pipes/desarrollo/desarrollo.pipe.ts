import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'desarrollo_titulo_pipe'
})
export class DesarrolloTituloPipe implements PipeTransform {
  transform(rows: any[], query: any): any {
    return query.length>0 ? rows.filter(item => item.titulo.toLowerCase().indexOf(query.toLowerCase())>-1) : rows;
  }

}
