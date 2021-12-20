import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScrapComponent } from './modal-scrap.component';

describe('ModalScrapComponent', () => {
  let component: ModalScrapComponent;
  let fixture: ComponentFixture<ModalScrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalScrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
