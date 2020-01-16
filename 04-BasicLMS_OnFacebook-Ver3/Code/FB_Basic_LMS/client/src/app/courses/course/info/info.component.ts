import { MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../services/courses.service';

import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CourseDetailEditorComponent } from './course-detail-editor/course-detail-editor.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnChanges {

  subscriptions: Subscription[] = [];

  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_course') current_course: string;
  courseData: {id: string, name: string, description: string, instructor: string};
  loading = true;
  description: string;
  instructor: string;
  instructorEmail: string;

  constructor(
    private courseServices: CoursesService,
    private userServices: UserService,
    private dialog: MatDialog,
    ) {}

  openEditCourse() {
    const dialogRef = this.dialog.open(CourseDetailEditorComponent, {
      width: '90%',
      data: this.courseData
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        console.log(result);
      }
    }));
  }

  ngOnInit() {
    this.loading = true;
    this.subscriptions.push(this.courseServices.getCourseInfo(this.current_course)
      .subscribe( (resp: {id: string, name: string, description: string, instructor: string}) => {
      this.courseData = resp;
      this.subscriptions.push(this.courseServices.getInstructorInfo(this.courseData.instructor)
        .subscribe( (response: {contactEmail: string, name: string}) => {
        this.instructor = response.name;
        this.instructorEmail = response.contactEmail;
      }));
      this.loading = false;
    }));
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  ngOnChanges() {
    this.ngOnInit();
  }
}
