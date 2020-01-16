import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeReportsComponent } from './grade-reports.component';

describe('GradeReportsComponent', () => {
  let component: GradeReportsComponent;
  let fixture: ComponentFixture<GradeReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
