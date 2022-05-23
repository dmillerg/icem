import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css'],
})
export class ModalProductoComponent implements OnInit {
  modalHeader: string = '';
  modalSubHeader: string = '';
  modalAction: string = 'Agregar';
  actiModal: NgbActiveModal;
  disableButton;

  producto: Producto = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
    categoria: -1,
    usos: '',
    especificaciones: '',
    garantia: '',
    ficha: '',
    precio: 0,
    disponibilidad: 0,
    activo: false,
  };

  categorias: Categoria[];
  uploadFiles: Array<File>;

  producto_pasado: Producto = {
    id: -1,
    titulo: '',
    descripcion: '',
    fecha: '',
    imagen: '',
    categoria: -1,
    usos: '',
    especificaciones: '',
    garantia: '',
    ficha: '',
    precio: 0.0,
    disponibilidad: 0,
    activo: false,
  };
  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
    this.api.getCategorias().subscribe((result)=>{
      this.categorias = result;
    })
  }

  rellenarSiEditas() {
    if (this.modalHeader == 'Editar') {
      this.producto_pasado.id = this.producto.id;
      this.producto_pasado.titulo = this.producto.titulo;
      this.producto_pasado.descripcion = this.producto.descripcion;
      this.producto_pasado.fecha = this.producto.fecha;
      this.producto_pasado.imagen = this.producto.imagen;
      this.producto_pasado.categoria = this.producto.categoria;
      this.producto_pasado.usos = this.producto.usos;
      this.producto_pasado.especificaciones = this.producto.especificaciones;
      this.producto_pasado.garantia = this.producto.garantia;
      this.producto_pasado.precio = this.producto.precio;
      this.producto_pasado.disponibilidad = this.producto.disponibilidad;
    }
  }

  addUpdateProducto() {
    let formData = new FormData();
    console.log("uploadFiles", this.uploadFiles);
    if (this.uploadFiles != undefined) {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append("foto", this.uploadFiles[i], this.uploadFiles[i].name);
      }
    }
    formData.append('id',this.producto.id.toString());
    formData.append('titulo',this.producto.titulo.toString());
    formData.append('descripcion',this.producto.descripcion.toString());
    formData.append('categoria',this.producto.categoria.toString());
    formData.append('usos',this.producto.usos.toString());
    formData.append('especificaciones',this.producto.especificaciones.toString());
    formData.append('garantia',this.producto.garantia.toString());
    formData.append('precio',this.producto.precio.toString());
    formData.append('disponibilidad',this.producto.disponibilidad.toString());
    // console.log("formData :",formData);
    // console.log("producto :",this.producto);
    console.log(this.modalAction, this.modalAction== "Editar");
    if(this.modalAction =="Editar"){
      this.api.updateProducto(formData, this.producto.id).subscribe((result)=>{
        console.log(result);
        this.actiModal.close('Productos');
      },(error)=>{
        console.log(error);
        this.actiModal.close('Productos');
      });
    } else {
      this.api.addProducto(formData).subscribe((result)=>{
        console.log(result);
        this.actiModal.close('Productos');
      }, (error)=>{
        console.log(error);
        this.actiModal.close('Productos');
      })
    }

  }

  fileEvent(fileInput) {
    let file = (<HTMLInputElement>fileInput.target).files[0];
    //  console.log(fileInput);
    this.uploadFiles = fileInput.target.files;
    console.log(this.uploadFiles);
    
    const reader = new FileReader();
    reader.onload = () => {
      this.producto.imagen = reader.result as string;
    }
    reader.readAsDataURL(file);
  }


}
