import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'producto_categoria'
})
export class ProductoCategoriaPipe implements PipeTransform {
  transform(rows: any[], query: any): any {
    if (query == -1) return rows;
    return rows.filter(item => item.categoria == query);
  }

}
