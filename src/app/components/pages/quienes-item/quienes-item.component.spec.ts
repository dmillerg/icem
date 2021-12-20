import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuienesItemComponent } from './quienes-item.component';

describe('QuienesItemComponent', () => {
  let component: QuienesItemComponent;
  let fixture: ComponentFixture<QuienesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuienesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuienesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
