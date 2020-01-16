import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../services/courses.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {EnrollDialogComponent} from '../confirm-enroll/enroll-dialog/enroll-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-rollcall',
  templateUrl: './rollcall.component.html',
  styleUrls: ['./rollcall.component.scss']
})

export class RollcallComponent implements OnInit {

  loading = true;
  // tslint:disable-next-line:no-input-rename variable-name
  @Input('current_course') current_course: string;
  students: {id: string, fname: string, lname: string, email: string, phone: string}[];

  subscriptions: Subscription[] = [];

  constructor(
    private courseServices: CoursesService,
    private userServices: UserService,
    private dialog: MatDialog,

  ) {}

  loadData() {
    this.subscriptions.push(this.courseServices.getStudents(this.current_course)
      .subscribe( (resp: {id: string, fname: string, lname: string, email: string, phone: string}[]) => {
        this.students = resp;
        console.log(resp);
      }));
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  openEnrollDialog(student) {
    const dialogRef = this.dialog.open(EnrollDialogComponent, {
      width: '450px',
      data: {course: this.current_course, student, enrolled: true},

    });
    dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}
