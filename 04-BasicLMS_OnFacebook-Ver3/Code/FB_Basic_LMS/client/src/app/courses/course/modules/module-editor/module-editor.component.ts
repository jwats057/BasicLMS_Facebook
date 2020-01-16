import { YesNoDialogComponent } from 'src/app/yes-no-dialog/yes-no-dialog.component';
import { CoursesService } from '../../../../services/courses.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Resource } from 'src/app/models/courses.models';
import { NewContentComponent } from '../new-content/new-content.component';

@Component({
  selector: 'app-module-editor',
  templateUrl: './module-editor.component.html',
  styleUrls: ['./module-editor.component.scss']
})
export class ModuleEditorComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  current_course: string;
  // tslint:disable-next-line:variable-name
  current_module: {id: string, name: string, resources: Resource[]};
  submitting = false;
  changed = false;
  moduleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModuleEditorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {module:{id: string, name: string, resources: Resource[]}, course_id: string},
    private formBuilder: FormBuilder,
    private courseServices: CoursesService,
    private dialog: MatDialog,
  ) {
    this.current_course = data.course_id;
    this.current_module = data.module;
    this.moduleForm = this.formBuilder.group({
      title: [data.module.name, Validators.required],
    });
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(this.changed);
  }

  reloadModule() {
    this.courseServices.getCourseModule(this.current_course, this.current_module.id)
      .subscribe( (resp: {id: string, name: string, resources: Resource[]}) => {
      this.current_module = resp;
    });
  }

  createModule() {
    const newModule = {
      name: this.moduleForm.value.title
    };
    this.submitting = true;
    this.courseServices.newModule(this.current_course, newModule).subscribe( (resp) => {
      if (resp) {
        this.dialogRef.close(resp);
      }
      this.submitting = false;
    });
  }

  removeContent(content: Resource) {
    const yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Warning!',
        message: 'Do you really want to delete this discussion?\n This action cannot be undone.',
      }
    });

    yesNoDialogRef.afterClosed().subscribe( (resp: boolean) => {
      if (resp) {
        this.courseServices.removeContent(this.current_course, this.current_module.id, content.id)
          .subscribe( (response) => {
          if (response) {
            this.current_module.resources.splice(this.current_module.resources.indexOf(content));
            this.changed = true;
        }});
      }
    });
  }

  removeModule() {
    const yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Warning!',
        message: 'Do you really want to delete this discussion?\n This action cannot be undone.',
      }
    });

    yesNoDialogRef.afterClosed().subscribe( (resp) => {
      if (resp) {
        console.log('remove?', resp);
        this.courseServices.removeModule(this.current_course, this.current_module.id).subscribe( response => {
          if (response) {
            this.changed = true;
            this.onNoClick();
          }
        });
      }
    });
  }

  openNewContentDialog() {
    const dialogReference = this.dialog.open(NewContentComponent, {
      width: '90%',
      data: {
        course: this.current_course,
        current_module: this.current_module.id,
      }
    });
    dialogReference.afterClosed().subscribe( (result) => {
      if (result) {
        console.log(result);
        this.reloadModule();
        this.changed = true;
      }
    });
  }
}
