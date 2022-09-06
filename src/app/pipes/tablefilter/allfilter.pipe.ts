import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'allPipe'
})
export class AllPipe implements PipeTransform {

  transform(rows: any[], query: any): any {
    return query ? rows.filter(item => item.indexOf(query) >-1): rows;
  }

}
