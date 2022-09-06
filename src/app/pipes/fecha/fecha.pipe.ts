import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha_filter'
})
export class FechaPipe implements PipeTransform {
  transform(rows: any, query: any): any {
    return query ? rows.filter(item => item.fecha == query): rows;
  }

}
