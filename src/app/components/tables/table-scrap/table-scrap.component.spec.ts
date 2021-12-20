import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableScrapComponent } from './table-scrap.component';

describe('TableScrapComponent', () => {
  let component: TableScrapComponent;
  let fixture: ComponentFixture<TableScrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableScrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
