import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CoursesService} from '../../../../services/courses.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss']
})
export class NewConversationComponent implements OnInit {

  today = new Date();
  conversationForm: FormGroup;
  // tslint:disable-next-line:variable-name
  current_course: string;
  constructor(
    public dialogRef: MatDialogRef<NewConversationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: string,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private coursesServices: CoursesService,
  ) {
    this.conversationForm = this.FormBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isClosed: ['', Validators.required],
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
    return this.conversationForm.hasError('required', 'conversationForm.description')  ? ''
      : this.conversationForm.controls.description.dirty ? 'The description of a discussion cannot be empty!' : '';
  }

  ngOnInit() {
  }

  pushDiscussion() {
    const discussion = {
      title: this.conversationForm.value.title,
      description: this.conversationForm.value.description,
      isClosed: this.conversationForm.value.isClosed,
      endDate: this.conversationForm.value.endDate,
    };

    this.coursesServices.newDiscussion(this.current_course, discussion).subscribe( (resp) => {
      this.dialogRef.close(resp);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
