import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  constructor() { }

  private burbuja(title: string = 'Title', message: string = '') {
    let succ = document.createElement("div");
    let header = document.createElement("div");
    header.id = 'message-header';
    header.classList.add('message-header');
    if (title.length > 0) {
      let titles = document.createElement("label");
      let titletext = document.createTextNode(title + ': ');
      titles.appendChild(titletext);
      header.appendChild(titles);
    }
    let messagetext = document.createTextNode(message);
    succ.appendChild(messagetext);
    succ.id = 'message';
    succ.classList.add('message');
    let content = document.createElement('div');
    content.id = 'content-message';
    content.appendChild(header);
    content.appendChild(succ);
    content.classList.add('message-content')
    document.body.appendChild(content);
  }

  success(title: string = '', message: string = '') {
    this.burbuja(title, message);
    document.getElementById('message-header').classList.add('successmes');
    document.getElementById('message-header').classList.add('activoMessage');
    document.getElementById('message').classList.add('activoMessage');
    setTimeout(() => {
      document.getElementById('message-header').classList.remove('activoMessage');
      document.getElementById('message').classList.remove('activoMessage');
      setTimeout(()=>{
        document.body.removeChild(document.getElementById('content-message'));
      }, 500);
    }, 8000);
  }

  error(title: string = '', message: string = '') {
    this.burbuja(title, message);
    document.getElementById('message-header').classList.add('errormes');
    document.getElementById('message-header').classList.add('activoMessage');
    document.getElementById('message').classList.add('activoMessage');
    setTimeout(() => {
      document.getElementById('message-header').classList.remove('activoMessage');
      document.getElementById('message').classList.remove('activoMessage');
      setTimeout(()=>{
        document.body.removeChild(document.getElementById('content-message'));
      }, 500);
    }, 8000);
  }


}
