import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/models/categoria';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.component.html',
  styleUrls: ['./modal-categoria.component.css'],
})
export class ModalCategoriaComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  categoria: Categoria = {
    id: -1,
    nombre: '',
    descripcion: '',
  };

  categoria_pasado: Categoria = {
    id: -1,
    nombre: '',
    descripcion: '',
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.categoria_pasado.id = this.categoria.id;
      this.categoria_pasado.nombre = this.categoria.nombre;
    }
  }

  addUpdateCategoria() {
    let formData = new FormData();
    formData.append('id', this.categoria.id.toString());
    formData.append('nombre', this.categoria.nombre.toString());
    formData.append('descripcion', this.categoria.descripcion.toString());

    if (this.modalAction == 'Editar') {
      this.api.updateCategoria(formData, this.categoria.id).subscribe(
        (result) => {
          this.actiModal.close('Categorias');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Categorias');
          console.log(error);
        }
      );
    } else {
      this.api.addCategoria(formData).subscribe(
        (result) => {
          this.actiModal.close('Categorias');
          console.log(result);
        },
        (error) => {
          this.actiModal.close('Categorias');
          console.log(error);
        }
      );
    }
  }
}
