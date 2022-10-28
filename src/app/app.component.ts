import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { url } from 'inspector';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { ModalActivationComponent } from './modals/modal-activation/modal-activation.component';
import { ModalUserResetPasswordComponent } from './modals/modal-user-reset-password/modal-user-reset-password.component';
import { ApiService } from './services/api.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ transform: 'translateX(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [listAnimation,
    trigger('scaleAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-50%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  rate = 1;
  title = 'ICEM';
  back_class = 'navbar navbar-expand-lg navbar-dark fixed-top';
  back_oscuro = 'back-oscuro';
  back_transparente = 'back-transparent';
  back_final = '';
  loading: boolean = false;
  configuraciones: any[] = [];

  constructor(
    public storage: SessionStorageService,
    public localstorage: LocalStorageService,
    private api: ApiService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit=async()=> {
    await this.loadData();
    await this.cargarConfigs();
  //  this.loading = false;
  }

  ngOnInit(): void {
    
    // this.activate();
    
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.back_final = this.back_class + ' ' + this.back_transparente;
  }

  cargarConfigStorage = async()=>{
    this.storage.observe('configuraciones').subscribe(async (result) => {
      if (result && result.length != this.configuraciones.length)
        await this.cargarConfigs();
        return;
    });
  }

  loadData() {
    if (this.localstorage.retrieve('usuario')) {
      this.storage.store('usuario', this.localstorage.retrieve('usuario'));
    }
  }

  onScrolling() {
    let btn_scroll = document.getElementById('btnScroll');
    if (document.getElementById('scroll').scrollTop <= 100) {
      this.back_final = this.back_class + ' ' + this.back_transparente;
      btn_scroll.classList.remove('btn-scala');
      btn_scroll.classList.add('btn-scala-up');
    } else {
      this.back_final = this.back_class + ' ' + this.back_oscuro;
      btn_scroll.classList.add('btn-scala');
      btn_scroll.classList.remove('btn-scala-up');
    }
  }

  activate = async()=> {
    this.activatedRoute.queryParams.subscribe(params => {
      let link = params['link'];
      let reset = params['reset'];
      // console.log('link:  ', link);
      // console.log('reset:  ', reset);

      if (link && link.length > 0) {
        this.api.checkLinks(link, (this.storage.retrieve('configuraciones')[2].config * 60)).subscribe((res) => {
          this.modalService.open(ModalActivationComponent, { backdrop: 'static' });
        });
      } else if (reset != undefined) {
        this.api.checkLinks(reset).subscribe((res) => {
          this.modalService.open(ModalUserResetPasswordComponent, { backdrop: 'static' });
        });
      }
    });
  }

  onScroll(scroll: HTMLElement) {
    console.log(scroll)
    scroll.scrollIntoView({ behavior: "smooth" });
  }

  topScroll(event) {
    console.log(event);
  }

  cargarConfigs() {
    this.api.getConfiguraciones().subscribe(async (result) => {
      this.configuraciones = result;
      this.storage.store('configuraciones', result)
      await this.activate();
      return
    });
  }

  closeChat(){
    document.querySelector('.chat-fixed-position').classList.toggle('closed');
  }
}
