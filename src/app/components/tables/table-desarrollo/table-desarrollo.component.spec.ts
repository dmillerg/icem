import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDesarrolloComponent } from './table-desarrollo.component';

describe('TableDesarrolloComponent', () => {
  let component: TableDesarrolloComponent;
  let fixture: ComponentFixture<TableDesarrolloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDesarrolloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDesarrolloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
