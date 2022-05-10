import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  constructor() { }

  private burbuja(title: string = 'Title', message: string = 'message') {
    let succ = document.createElement("div");
    if (title.length > 0) {
      let titles = document.createElement("label");
      let titletext = document.createTextNode(title + ': ');
      titles.appendChild(titletext);
      succ.appendChild(titles);
    }
    let messages = document.createElement("label");
    messages.style.marginLeft = '10px';
    let messagetext = document.createTextNode(message);
    messages.appendChild(messagetext);

    succ.appendChild(messages);
    succ.id = 'message';
    succ.classList.add('message');
    let content = document.createElement('div');
    content.id = 'content-message';
    content.appendChild(succ);
    content.classList.add('message-content')
    document.body.appendChild(content);
  }

  success(title: string = '', message: string = 'message') {
    this.burbuja(title, message);
    document.getElementById('message').classList.add('successmes');
    document.getElementById('message').classList.add('activoMessage');
    setTimeout(() => {
      document.getElementById('message').classList.remove('activoMessage');
      setTimeout(()=>{
        document.body.removeChild(document.getElementById('content-message'));
      }, 500);
    }, 8000);
  }

  error(title: string = '', message: string = 'message') {
    this.burbuja(title, message);
    document.getElementById('message').classList.add('errormes');
    document.getElementById('message').classList.add('activoMessage');
    setTimeout(() => {
      document.getElementById('message').classList.remove('activoMessage');
      setTimeout(()=>{
        document.body.removeChild(document.getElementById('content-message'));
      }, 500);
    }, 8000);
  }


}
