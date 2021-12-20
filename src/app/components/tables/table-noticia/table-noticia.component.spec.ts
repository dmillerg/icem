import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNoticiaComponent } from './table-noticia.component';

describe('TableNoticiaComponent', () => {
  let component: TableNoticiaComponent;
  let fixture: ComponentFixture<TableNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableNoticiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
