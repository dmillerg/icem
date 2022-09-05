import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noticia_fuente_filter'
})
export class NoticiaFuentePipe implements PipeTransform {

  transform(rows: any[], query: any): any {
    return query.length>0 ? rows.filter(item => item.fuente.toLowerCase().indexOf(query.toLowerCase())>-1) : rows;
  }

}
