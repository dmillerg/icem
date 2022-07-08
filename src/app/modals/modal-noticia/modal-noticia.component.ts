import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Categoria } from 'src/app/models/categoria';
import { Noticia } from 'src/app/models/noticias';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-noticia',
  templateUrl: './modal-noticia.component.html',
  styleUrls: ['./modal-noticia.component.css'],
})
export class ModalNoticiaComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  noticia: Noticia = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
    enlace: '',
    fuente: 'ICEM',
    logo: '',
  };

  uploadFiles: Array<File>;

  noticia_pasado: Noticia = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
    enlace: '',
    fuente: 'ICEM',
    logo: '',
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService, public storage: SessionStorageService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.noticia_pasado.id = this.noticia.id;
      this.noticia_pasado.titulo = this.noticia.titulo;
      this.noticia_pasado.descripcion = this.noticia.descripcion;
      this.noticia_pasado.fecha = this.noticia.fecha;
      this.noticia_pasado.imagen = this.noticia.imagen;
    }
  }

  addUpdateNoticia() {
    let formData = new FormData();
    console.log('uploadFiles', this.uploadFiles);
    if (this.uploadFiles != undefined) {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append('foto', this.uploadFiles[i], this.uploadFiles[i].name);
      }
    }
    formData.append('id', this.noticia.id.toString());
    formData.append('titulo', this.noticia.titulo.toString());
    formData.append('descripcion', this.noticia.descripcion.toString());
    formData.append('logo', this.noticia.logo.toString());
    formData.append('fuente', this.noticia.fuente.toString());
    formData.append('enlace', this.noticia.enlace.toString());
    // console.log("formData :",formData);
    // console.log("producto :",this.producto);
    if (this.modalAction == 'Editar') {
      this.api.updateNoticia(formData, this.noticia.id).subscribe(
        (result) => {
          this.actiModal.close('Noticias');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Noticias');
          console.log(error);
        }
      );
    } else {
      this.api.addNoticia(formData).subscribe(
        (result) => {
          this.actiModal.close('Noticias');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Noticias');
          console.log(error);
        }
      );
    }
  }

  fileEvent(fileInput) {
    let file = (<HTMLInputElement>fileInput.target).files[0];
    //  console.log(fileInput);
    this.uploadFiles = fileInput.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      this.noticia.imagen = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
