import { EnrollDialogComponent } from './enroll-dialog/enroll-dialog.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-enroll',
  templateUrl: './confirm-enroll.component.html',
  styleUrls: ['./confirm-enroll.component.scss']
})
export class ConfirmEnrollComponent implements OnInit {

  loading = true;
  students: {id: string, fname: string, lname: string, email: string, phone: string}[];
  subscriptions: Subscription[] = [];
  waiting = 0;
  // tslint:disable-next-line:variable-name
  current_course = '';

  constructor(
    private coursesServices: CoursesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.subscriptions.push(this.route.queryParams.subscribe( params => {
      if (params.course) {
        this.current_course = params.course;
      }
      this.subscriptions.push(this.coursesServices
        .getRegistered(this.current_course)
        .subscribe( (resp: {id: string, fname: string,
          lname: string, email: string, phone: string}[]) => {
          this.students = resp;
          this.loading = false;
         }));
      this.subscriptions.push(this.coursesServices.getWaitlistSize(this.current_course)
        .subscribe( (resp: number) => {
          this.waiting = resp;
        }));
    }));
  }

  openEnrollDialog(student) {
    const dialogRef = this.dialog.open(EnrollDialogComponent, {
      width: '450px',
      data: {course: this.current_course, student, enrolled: false}
    });
    dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
