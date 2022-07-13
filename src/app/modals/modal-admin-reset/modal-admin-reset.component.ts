import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-admin-reset',
  templateUrl: './modal-admin-reset.component.html',
  styleUrls: ['./modal-admin-reset.component.css']
})
export class ModalAdminResetComponent implements OnInit {

  usuario: Usuario;
  password: string = ''
  confirm: string = ''
  actiModal: NgbActiveModal

  constructor(private activeModal: NgbActiveModal, private api: ApiService, private storage: SessionStorageService) {
    this.actiModal = activeModal;
  }

  ngOnInit(): void {
  }

  resetear() {
    let formData = new FormData();
    formData.append('id_usuario', this.usuario.id.toString())
    formData.append('new_password', this.password)
    this.api.adminResetPassword(formData, this.storage.retrieve('usuario').token).subscribe((result) => {
      console.log(result);
      
      this.actiModal.close();
    }, err => {
      console.error(err);
    })
  }

}
