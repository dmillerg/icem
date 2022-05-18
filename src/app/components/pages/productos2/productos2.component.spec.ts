import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productos2Component } from './productos2.component';

describe('Productos2Component', () => {
  let component: Productos2Component;
  let fixture: ComponentFixture<Productos2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Productos2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Productos2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
