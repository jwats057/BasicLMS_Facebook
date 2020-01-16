import { Subscription } from 'rxjs/internal/Subscription';
import { CoursesService } from '../../services/courses.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-newcourse',
  templateUrl: './newcourse.component.html',
  styleUrls: ['./newcourse.component.scss']
})

export class NewcourseComponent implements OnInit {

  subscriptions: Subscription[] = [];
  courseForm: FormGroup;
  today = new Date();
  instructors: {name: string, id: string}[] = [];
  categories: {name: string}[] = [];
  MAX_SIZE: {MAX_SIZE: number};
  isOpen: {isOpen: boolean};

  constructor(
    public dialogRef: MatDialogRef<NewcourseComponent>,
    private formBuilder: FormBuilder,
    private courseServices: CoursesService
  ) {
    this.courseForm = this.formBuilder.group({
      title: ['', Validators.required],
      instructor: ['', Validators.required],
      description: ['', Validators.required],
      endEnrollDate: ['', Validators.required],
      category: ['', Validators.required],
      MAX_SIZE: ['', Validators.required],
      isOpen: ['', Validators.required]
    });
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    outline: true,
    sanitize: false,
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };


  addCourse() {
    if (this.courseForm.pristine) {
      this.dialogRef.close();
    }  else {
      const course = {
        name: this.courseForm.value.title,
        instructor_id: this.courseForm.value.instructor,
        description: this.courseForm.value.description,
        MAX_SIZE: this.courseForm.value.MAX_SIZE,
        isOpen: true,
        endEnrollDate: this.courseForm.value.endEnrollDate,
        category: this.courseForm.value.category
      };
      this.subscriptions.push(this.courseServices.addCourse(course).subscribe( (resp) => {
        if (resp) {
          this.dialogRef.close(resp);
        }
      }));
    }
  }

  getDescriptionError() {
    return this.courseForm.hasError('required', 'courseForm.description')  ? '' : 'The description of a course cannot be empty!';
  }

  ngOnInit() {
    this.subscriptions.push(this.courseServices.getAllInstructors().subscribe( (resp: {name: string, id: string}[]) => {
      this.instructors = resp;
    }));
    this.categories = this.courseServices.getAllCategories();
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
