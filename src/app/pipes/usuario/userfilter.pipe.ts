import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'user_pipe'
})
export class UserPipe implements PipeTransform {
  transform(rows: any, query: string): any {
      return query ? rows.filter(item => item.usuario.toLowerCase().indexOf(query.toLowerCase()) > -1): rows;
  }
}

@Pipe({
  name: 'user_active_pipe'
})
export class UserActivePipe implements PipeTransform {
  transform(rows: any[], query: any): any {
    if (query == -1) return rows;
    return rows.filter(item => item.activo == query);
  }
}
