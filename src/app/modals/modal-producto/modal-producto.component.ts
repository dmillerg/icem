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

  imagenes: any[] = [];
  imagenes_eliminadas: any[] = [];
  position: number = 0;

  constructor(private activeModal: NgbActiveModal, private api: ApiService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
    this.rellenarSiEditas();
    this.api.getCategorias().subscribe((result) => {
      this.categorias = result;
    });
    this.position = this.producto.imagen.split(',').length;
  }

  rellenarSiEditas() {
    if (this.modalAction == 'Editar') {
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
      console.log('Ediatr');

      this.getFotos();
    }
  }

  getFotos() {
    if (this.producto.imagen != '') {
      this.producto.imagen.split(',').forEach(e => {
        this.api.getProductoFotoName(e).subscribe(resul => {

        }, error => {
          this.imagenes.push(error.url)
        })
      });
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
    formData.append('id', this.producto.id.toString());
    formData.append('titulo', this.producto.titulo.toString());
    formData.append('descripcion', this.producto.descripcion.toString());
    formData.append('categoria', this.producto.categoria.toString());
    formData.append('usos', this.producto.usos.toString());
    formData.append('especificaciones', this.producto.especificaciones.toString());
    formData.append('garantia', this.producto.garantia.toString());
    formData.append('precio', this.producto.precio.toString());
    formData.append('imagen', this.producto.imagen.toString());
    formData.append('disponibilidad', this.producto.disponibilidad.toString());
    // console.log("formData :",formData);
    // console.log("producto :",this.producto);
    console.log(this.modalAction, this.modalAction == "Editar");
    if (this.modalAction == "Editar") {
      formData.append('eliminadas', this.imagenes_eliminadas.toString());
      formData.append('position', this.position.toString());
      this.api.updateProducto(formData, this.producto.id).subscribe((result) => {
        console.log(result);
        this.actiModal.close('Productos');
      }, (error) => {
        console.log(error);
        this.actiModal.close('Productos');
      });
    } else {
      this.api.addProducto(formData).subscribe((result) => {
        console.log(result);
        this.actiModal.close('Productos');
      }, (error) => {
        console.log(error);
        this.actiModal.close('Productos');
      })
    }

  }

  fileEvent(fileInput) {
    // this.imagenes = []
    let files = (<HTMLInputElement>fileInput.target).files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      //  console.log(fileInput);
      this.uploadFiles = fileInput.target.files;
      console.log(this.uploadFiles);

      const reader = new FileReader();
      reader.onload = () => {
        // this.producto.imagen = reader.result as string;
        this.imagenes.push(reader.result as string);
      }
      reader.readAsDataURL(file);
    }
  }


  eliminarFoto(name: string) {
    let nombre = name.substring(name.indexOf('=') + 1, name.length)
    console.log(name);

    if (this.producto.imagen.split(',').filter((e) => e == nombre).length > 0) {
      let i = this.producto.imagen.split(',').indexOf(nombre);
      this.producto.imagen = this.producto.imagen.split(',').splice(i).toString();
      this.imagenes_eliminadas.push(nombre);
    }
    let pos = this.imagenes.indexOf(name);
    console.log(pos);

    this.imagenes.splice(pos);
  }
}
