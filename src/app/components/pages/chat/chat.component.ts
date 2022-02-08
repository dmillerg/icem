import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  intervalo;

  constructor(private api: ApiService) { }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  ngOnInit(): void { }

  loadChats() {
    this.api.getChats().subscribe((result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          if (this.mensajes.find((e) => e.id == item.id ) == undefined) {
            console.log(item);
            this.convertir(item);
          }
        });
      }
    });
  }

  convertir(item) {
    this.api.getChatFoto(item.id).subscribe(
      (result) => console.log('result', result),
      (error) => {
        item.imagen = error.url;
        this.mensajes.push(item);
        this.cantMax = this.mensajes.length;
        document.getElementById("final").scrollIntoView({behavior: "smooth"});
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
        formData.append('foto', this.uploadFiles[i], this.uploadFiles[i].name);
      }
    }
    formData.append('sms', this.sms.toString());
    formData.append('nombre', this.nombre.toString());
    formData.append('fecha', Date.now().toString());
    this.api.addChat(formData).subscribe((result) => {
      this.sms = '';
      this.uploadFiles = undefined;
      this.message = '';
      this.loadChats();
    });
  }

  fileEvent(fileInput) {
    let file = (<HTMLInputElement>fileInput.target).files[0];
    //  console.log(fileInput);
    this.uploadFiles = fileInput.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      // this.desarrollo.imagen = reader.result as string;
      this.message = 'archivo subido correctamente';
    };
    reader.readAsDataURL(file);
  }

  scrollBottom() {
    let cant = 10;
    const anim = setInterval(() => {
      if (
        document.getElementById('box-sms').scrollTop <
        document.getElementById('box-sms').scrollHeight - 400
      ) {
        cant += 1.5;
        document.getElementById('box-sms').scrollTop += cant;
      } else {
        clearInterval(anim);
      }
    }, 1);
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
    this.api.downloadFoto(nombre).subscribe(
      (result) => console.log(result),
      (error) => console.log(error)
    );
  }
}
