import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CoursesService } from '../../../../services/courses.service';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Optional, Inject } from '@angular/core';

@Component({
  selector: 'app-new-discussion',
  templateUrl: './new-discussion.component.html',
  styleUrls: ['./new-discussion.component.scss']
})
export class NewDiscussionComponent implements OnInit {

  today = new Date();
  discussionForm: FormGroup;
  // tslint:disable-next-line:variable-name
  current_course: string;
  constructor(
    public dialogRef: MatDialogRef<NewDiscussionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: string,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private coursesServices: CoursesService,
  ) {
    this.discussionForm = this.FormBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isClosed: [false, Validators.required],
      endDate: ['', Validators.required],
    });
    this.current_course = data;
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

  getDescriptionError() {
    return this.discussionForm.hasError('required', 'discussionForm.description')  ? ''
      : this.discussionForm.controls.description.dirty ? 'The description of a discussion cannot be empty!' : '';
  }

  ngOnInit() {
  }

  pushDiscussion() {
    const discussion = {
      title: this.discussionForm.value.title,
      description: this.discussionForm.value.description,
      isClosed: this.discussionForm.value.isClosed,
      endDate: this.discussionForm.value.endDate,
    };

    this.coursesServices.newDiscussion(this.current_course, discussion).subscribe( (resp) => {
      this.dialogRef.close(resp);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
