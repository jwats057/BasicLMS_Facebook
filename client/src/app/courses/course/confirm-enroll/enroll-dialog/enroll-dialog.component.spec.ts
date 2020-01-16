import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollDialogComponent } from './enroll-dialog.component';

describe('EnrollDialogComponent', () => {
  let component: EnrollDialogComponent;
  let fixture: ComponentFixture<EnrollDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
