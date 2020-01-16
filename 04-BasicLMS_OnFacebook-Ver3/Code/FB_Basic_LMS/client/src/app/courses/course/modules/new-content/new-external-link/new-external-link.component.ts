import { EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NewContentComponent } from './../new-content.component';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit, Input, Output } from '@angular/core';
import { CoursesService } from 'src/app/services/courses.service';

function urlValidator(control: FormControl) {
  const link: string = control.value;
  if (link.indexOf('http://') !== 0 && link.indexOf('https://') !== 0) {

    return link;
  }
  return null;
}

@Component({
  selector: 'app-new-external-link',
  templateUrl: './new-external-link.component.html',
  styleUrls: ['./new-external-link.component.scss']
})
export class NewExternalLinkComponent implements OnInit {

  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_dialog') current_dialog: MatDialogRef<NewContentComponent>;
  // tslint:disable-next-line:no-input-rename
  @Input('data') data: {course: string, current_module: string};
  @Output() isSubmitting = new EventEmitter<boolean>();
  newLinkForm: FormGroup;
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private coursesServices: CoursesService,
  ) {
    this.newLinkForm = this.formBuilder.group({
      title: ['', Validators.required],
      link: ['https://', [Validators.required, urlValidator]]
    });
  }

  pushLink() {
    const content = {
      title: this.newLinkForm.value.title,
      url: this.newLinkForm.value.link
    };
    this.submitting = true;
    this.isSubmitting.emit(true);
    this.coursesServices.newContentPush(this.data.course, this.data.current_module, content).subscribe( (resp) => {
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
