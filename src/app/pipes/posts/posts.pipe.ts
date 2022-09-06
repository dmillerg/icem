import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'posts_usuario_pipe'
})
export class PostsUsuarioPipe implements PipeTransform {
  transform(rows: any[], query: any): any {
    return query ? rows.filter(item => item.alias.toLowerCase().indexOf(query.toLowerCase())>-1) : rows;
  }

}

@Pipe({
  name: 'posts_correo_pipe'
})
export class PostsCorreoPipe implements PipeTransform {
  transform(rows: any[], query: any): any {
    return query ? rows.filter(item => item.correo.toLowerCase().indexOf(query.toLowerCase())>-1) : rows;
  }

}

@Pipe({
  name: 'posts_visto_pipe'
})
export class PostsVistoPipe implements PipeTransform {
  transform(rows: any[], query: any): any {
    return query && query==-1 ? rows : rows.filter(item => item.cant_resp == query);
  }

}
