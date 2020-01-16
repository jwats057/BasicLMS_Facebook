import { CoursesService } from '../../../../services/courses.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { YesNoDialogComponent } from 'src/app/yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'app-discussion-editor',
  templateUrl: './discussion-editor.component.html',
  styleUrls: ['./discussion-editor.component.scss']
})
export class DiscussionEditorComponent implements OnInit {

  today = new Date();
  // tslint:disable-next-line:variable-name
  initial_date = this.today;
  discussionForm: FormGroup;
  // tslint:disable-next-line:variable-name
  current_course: string;
  // tslint:disable-next-line:variable-name
  current_discussion: string;
  submitting = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '15rem',
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

  constructor(
    public dialogRef: MatDialogRef<DiscussionEditorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {course: string, id: string,
      title: string, description: string, isClosed: boolean, endDate: string},
    private formBuilder: FormBuilder,
    private coursesServices: CoursesService,
    private dialog: MatDialog,
  ) {
    this.discussionForm = this.formBuilder.group({
      title: [data.title , Validators.required],
      description: [data.description , Validators.required],
      isClosed: [data.isClosed , Validators.required],
      endDate: [new Date(data.endDate) , Validators.required],
    });
    this.initial_date = new Date(data.endDate);
    this.current_discussion = data.id;
    this.current_course = data.course;
  }

  ngOnInit() {
  }

  getDescriptionError() {
    return this.discussionForm.hasError('required', 'discussionForm.description')  ? '' :
      this.discussionForm.controls.description.dirty ? 'The description of a discussion cannot be empty!' : '';
  }

  onNoClick() {
    this.dialogRef.close();
  }

  updateDiscussion() {
    const discussion = {
      id: this.current_discussion,
      title: this.discussionForm.value.title,
      description: this.discussionForm.value.description,
      isClosed: this.discussionForm.value.isClosed,
      endDate: this.discussionForm.value.endDate,
    };

    this.submitting = true;
    document.getElementById('form').style.display = 'block';
    this.coursesServices.updateDiscussion(this.current_course, discussion).subscribe( (resp) => {
      if(resp) {
        this.dialogRef.close(resp);
      }
      this.submitting = false;
      document.getElementById('form').style.display = 'none';
    });
  }

  tryDelete() {
    const yesNodialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Warning!',
        message: 'Do you really want to delete this discussion?\n This action cannot be undone.',
      }
    });

    yesNodialogRef.afterClosed().subscribe( (resp: boolean) => {
      if (resp) {
        this.submitting = true;
        document.getElementById('form').style.display = 'block';
        this.coursesServices.deleteDiscussion(this.current_course, this.current_discussion)
          .subscribe( (response) => {
          if (response) {
            this.dialogRef.close(response);
          }
          this.submitting = false;
          document.getElementById('form').style.display = 'none';
        });
      }
    });
  }
}
