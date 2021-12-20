import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Desarrollo } from 'src/app/models/desarrollo';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-desarrollo',
  templateUrl: './modal-desarrollo.component.html',
  styleUrls: ['./modal-desarrollo.component.css'],
})
export class ModalDesarrolloComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  desarrollo: Desarrollo = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
  };

  uploadFiles: Array<File>;

  desarrollo_pasado: Desarrollo = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.desarrollo_pasado.id = this.desarrollo.id;
      this.desarrollo_pasado.titulo = this.desarrollo.titulo;
      this.desarrollo_pasado.descripcion = this.desarrollo.descripcion;
      this.desarrollo_pasado.fecha = this.desarrollo.fecha;
      this.desarrollo_pasado.imagen = this.desarrollo.imagen;
    }
  }

  addUpdateDesarrollo() {
    let formData = new FormData();
    console.log('uploadFiles', this.uploadFiles);
    if (this.uploadFiles != undefined) {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append('foto', this.uploadFiles[i], this.uploadFiles[i].name);
      }
    }
    formData.append('id', this.desarrollo.id.toString());
    formData.append('titulo', this.desarrollo.titulo.toString());
    formData.append('descripcion', this.desarrollo.descripcion.toString());
    // console.log("formData :",formData);
    // console.log("producto :",this.producto);
    if (this.modalAction == 'Editar') {
      this.api.updateDesarrollo(formData, this.desarrollo.id).subscribe(
        (result) => {
          this.actiModal.close('Desarrollos');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Desarrollos');
          console.log(error);
        }
      );
    } else {
      this.api.addDesarrollos(formData).subscribe(
        (result) => {
          this.actiModal.close('Desarrollos');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Desarrollos');
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
      this.desarrollo.imagen = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
