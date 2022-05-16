import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat';
import { ApiService } from 'src/app/services/api.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ transform: 'translateY(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [listAnimation]
})
export class ChatComponent implements OnInit, OnDestroy {
  disable: boolean = true;
  nombre: string = '';
  mensajes: any[] = [];
  sms: string = '';
  uploadFiles: Array<File> = undefined;
  message: string = '';
  borrando: boolean = false;
  cantBorradas: number = 0;
  cantMax: number = 0;
  messageChat: string = 'El chat no contiene ningun mensaje...';
  id: number = -1;
  id_respondido: number = -1;
  mensaje_responder: string = '';
  intervalo;

  constructor(private api: ApiService) { }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  ngOnInit(): void { }

  loadChats() {
    this.api.getChats(this.onlyID()).subscribe((result) => {
      if (result.length > 0) {
        result.forEach((item, i) => {
          console.log(item);
          this.convertir(item, i == result.length - 1);
        });
      }
    });
  }

  onlyID() {
    let onlyid: number[] = []
    this.mensajes.forEach(e => {
      onlyid.push(e.id);
    });
    return onlyid;
  }

  responderSMS(item: Chat) {
    this.mensaje_responder = item.sms
    this.id_respondido = item.id;
  }

  convertir(item, ultimo: boolean) {
    this.api.getChatFoto(item.id).subscribe(
      (result) => console.log('result', result),
      (error) => {
        item.imagen = error.url;
        this.api.getChatByID(item.id_respondido).subscribe((result) => {
          if (result != null) {
            item.respuesta = result.sms;
          }
          // if (item.archivo.length>0) {
            item.extension = item.archivo.substring(item.archivo.length-3, item.archivo.length);
            console.log(item.extension);
            
          // }
          this.mensajes.push(item);
          this.cantMax = this.mensajes.length;
          // document.getElementById("box-sms").scrollTop = document.getElementById("box-sms").scrollHeight;
          if (ultimo) {
            setTimeout(() => {
              document.getElementById("final").scrollIntoView({ behavior: "smooth" });

            })
            // this.scrollBottom();
          }
        })
      }
    );
  }

  comenzar() {
    this.disable = !this.disable;
    console.log(this.nombre);
    this.loadChats();
    this.intervalo = setInterval(() => {
      this.loadChats();
    }, 10000);
  }

  enviar() {
    let formData = new FormData();
    if (this.uploadFiles != undefined) {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append('foto', this.uploadFiles[i], this.uploadFiles[i].lastModified.toString());
        formData.append('extension', this.uploadFiles[i].name.substring(this.uploadFiles[i].name.indexOf('.') + 1, this.uploadFiles[i].name.length));
      }
    }
    formData.append('sms', this.sms.toString());
    formData.append('nombre', this.nombre.toString());
    formData.append('fecha', Date.now().toString());
    formData.append('respondido', (this.id_respondido > -1).toString());
    formData.append('id_respondido', this.id_respondido.toString());
    this.api.addChat(formData).subscribe((result) => {
      this.sms = '';
      this.uploadFiles = undefined;
      this.message = '';
      this.mensaje_responder = '';
      this.id_respondido = -1;
      this.loadChats();
    });
  }

  fileEvent(fileInput) {
    let file = (<HTMLInputElement>fileInput.target).files[0];
    //  console.log(fileInput);
    this.uploadFiles = fileInput.target.files;
    console.log(this.uploadFiles);

    const reader = new FileReader();
    reader.onload = () => {
      // this.desarrollo.imagen = reader.result as string;
      this.message = 'archivo subido correctamente';
    };
    reader.readAsDataURL(file);
  }

  upload() {
    document.getElementById('formFile').click();
  }

  borrarTodo() {
    this.borrando = true;
    if (this.mensajes.length > 0) {
      let mensaje = this.mensajes[this.mensajes.length - 1];
      this.api.deleteChat(mensaje.id).subscribe(
        (result) => {
          this.cantBorradas++;
          this.mensajes = this.mensajes.filter((item) => item.id != mensaje.id);
          this.borrarTodo();
        },
        (error) => console.log(error)
      );
    } else {
      this.cantBorradas = 0;
      this.borrando = false;
    }
  }

  downloadFile(nombre) {
    this.api.downloadFile(nombre).subscribe(
      (result) => {
        let blob: Blob = result.body as Blob;
        console.log('sss', blob);

        let a = document.createElement('a');
        a.download = nombre.toString();
        a.href = window.URL.createObjectURL(blob)
        a.target = "_blank"
        a.click();
        console.log(result)
      },
      (error) => console.log(error)
    );
  }
}
