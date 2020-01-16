import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CoursesService } from '../../../../../services/courses.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewContentComponent } from './../new-content.component';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss']
})
export class NewPageComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private coursesServices: CoursesService
  ) {
    this.newPageForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
   }

  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_dialog') current_dialog: MatDialogRef<NewContentComponent>;
  // tslint:disable-next-line:no-input-rename
  @Input('data') data: {course: string, current_module: string};
  @Output() isSubmitting = new EventEmitter<boolean>();
  newPageForm: FormGroup;
  submitting = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '10rem',
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

   pushPage() {
     const page = {
       title: this.newPageForm.value.title,
       page: this.newPageForm.value.body
     };
     console.log(this.data.course, this.data.current_module, page);
     this.submitting = true;
     this.isSubmitting.emit(true);
     this.coursesServices.newContentPush(this.data.course, this.data.current_module, page).subscribe( (resp) => {
       if (resp) {
         this.current_dialog.close(resp);
       }
       this.submitting = false;
       this.isSubmitting.emit(false);
     });
   }

  ngOnInit() {}

  onNoClick() {
    this.current_dialog.close();
  }
}
