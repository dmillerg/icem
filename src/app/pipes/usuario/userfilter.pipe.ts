import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'user_filter'
})
export class UserFilter implements PipeTransform {
  transform(value: any, args: string): any {
    if (args) {
      return value.filter(item => item.usuario.toLowerCase().indexOf(args.toLowerCase()) > -1);
    } else {
      return value;
    }
  }
}

@Pipe({
  name: 'user_active_filter'
})
export class UserActiveFilter implements PipeTransform {
  transform(rows: any[], query: any): any {
    if (query == -1) return rows;
    return rows.filter(item => item.activo == query);
  }
}
