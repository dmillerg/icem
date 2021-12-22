import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPostsComponent } from './modal-posts.component';

describe('ModalPostsComponent', () => {
  let component: ModalPostsComponent;
  let fixture: ComponentFixture<ModalPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
