import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailEditorComponent } from './course-detail-editor.component';

describe('CourseDetailEditorComponent', () => {
  let component: CourseDetailEditorComponent;
  let fixture: ComponentFixture<CourseDetailEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDetailEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDetailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
