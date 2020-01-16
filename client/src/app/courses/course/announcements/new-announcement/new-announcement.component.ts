import {Component, Inject, OnInit, Optional} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CoursesService} from '../../../../services/courses.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.component.html',
  styleUrls: ['./new-announcement.component.scss']
})
export class NewAnnouncementComponent implements OnInit {

  today = new Date();
  announcementForm: FormGroup;
  // tslint:disable-next-line:variable-name
  current_course: string;

  constructor(
    public dialogRef: MatDialogRef<NewAnnouncementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: string,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private coursesServices: CoursesService,
    private userServices: UserService
  ) {
    this.announcementForm = this.FormBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      instructor: [false, Validators.required],
      date: ['', Validators.required]
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
    return this.announcementForm.hasError('required', 'announcementForm.description')  ? '' :
      this.announcementForm.controls.description.dirty ? 'The description of an announcement cannot be empty!' : '';
  }

  ngOnInit() {
  }

  pushAnnouncement() {
    const announcements = {
      title: this.announcementForm.value.title,
      description: this.announcementForm.value.description,
      instructor_name: this.userServices.fbUser().first_name + ' ' + this.userServices.fbUser().last_name,
      date: this.announcementForm.value.date,
    };
    console.log(announcements);
    this.coursesServices.newAnnouncement(this.current_course, announcements).subscribe( (resp) => {
      this.dialogRef.close(resp);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
