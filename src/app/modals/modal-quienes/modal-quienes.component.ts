import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Quienes } from 'src/app/models/quienes';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-quienes',
  templateUrl: './modal-quienes.component.html',
  styleUrls: ['./modal-quienes.component.css'],
})
export class ModalQuienesComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  quien: Quienes = {
    id: -1,
    nombre: '',
    cargo: '',
    imagen: '',
    orden: -1,
  };

  uploadFiles: Array<File>;

  quien_pasado: Quienes = {
    id: -1,
    nombre: '',
    cargo: '',
    imagen: '',
    orden: -1,
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.quien_pasado.id = this.quien.id;
      this.quien_pasado.nombre = this.quien.nombre;
      this.quien_pasado.cargo = this.quien.cargo;
      this.quien_pasado.orden = this.quien.orden;
      this.quien_pasado.imagen = this.quien.imagen;
    }
  }

  addUpdateQuienes() {
    let formData = new FormData();
    console.log("uploadFiles", this.uploadFiles);
    if (this.uploadFiles != undefined) {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append("foto", this.uploadFiles[i], this.uploadFiles[i].name);
      }
    }
    formData.append('id',this.quien.id.toString());
    formData.append('nombre',this.quien.nombre.toString());
    formData.append('cargo',this.quien.cargo.toString());
    formData.append('orden',this.quien.orden.toString());
    console.log(this.modalAction)
    if(this.modalAction =="Editar"){
      this.api.updateQuienes(formData, this.quien.id).subscribe((result)=>{
        console.log(result);
        this.actiModal.close('Quienes');
      },(error)=>{
        console.log(error);
        this.actiModal.close('Quienes');
      });
    } else {
      this.api.addQuienes(formData).subscribe((result)=>{
        console.log(result);
        this.actiModal.close('Quienes');
      }, (error)=>{
        console.log(error);
        this.actiModal.close('Quienes');
      })
    }

  }

  fileEvent(fileInput) {
    let file = (<HTMLInputElement>fileInput.target).files[0];
    //  console.log(fileInput);
    this.uploadFiles = fileInput.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      this.quien.imagen = reader.result as string;
    }
    reader.readAsDataURL(file);
  }


}
