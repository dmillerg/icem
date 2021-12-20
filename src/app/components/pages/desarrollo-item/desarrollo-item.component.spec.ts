import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesarrolloItemComponent } from './desarrollo-item.component';

describe('DesarrolloItemComponent', () => {
  let component: DesarrolloItemComponent;
  let fixture: ComponentFixture<DesarrolloItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesarrolloItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesarrolloItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
