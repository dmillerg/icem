import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaItemComponent } from './noticia-item.component';

describe('NoticiaItemComponent', () => {
  let component: NoticiaItemComponent;
  let fixture: ComponentFixture<NoticiaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticiaItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
