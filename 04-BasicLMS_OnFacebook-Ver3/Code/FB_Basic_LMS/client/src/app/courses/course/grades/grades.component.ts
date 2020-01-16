import { Subscription } from 'rxjs';
import { CoursesService } from '../../../services/courses.service';
import { UserService } from '../../../services/user.service';
import { Component, OnInit, Input } from '@angular/core';

export interface Record {
  id: string;
  title: string;
  dueDate: string;
  doneOn: string;
  score: number;
  outOf: number;
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {


  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_course') current_course: string;
  loading = true;
  private debugUser = this.userServices.fbUser().id;
  private subscriptions: Subscription[] = [];
  private percentage = 0;

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    ) {}

  displayedColumns: string[] = ['title', 'dueDate', 'doneOn', 'score', 'outOf'];
  dataSource: Record[] = [];

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.loading = true;
    this.subscriptions.push(this.coursesServices.getStudentCourseGrades(this.current_course, this.debugUser)
      .subscribe( (resp: Record[]) => {
      this.dataSource = resp;
      this.setPercent();
      this.loading = false;
    }));
  }

  setPercent() {
    let now: Date;
    let total = 0;
    let score = 0;
    this.coursesServices.getServerTime().subscribe((time: Date) => {
      now = new Date(time);
      this.dataSource.forEach( record => {
        console.log('doneOn', record.doneOn != null);
        console.log('dueDate', new Date(record.dueDate).getTime() < now.getTime());
        if (record.doneOn != null || new Date(record.dueDate).getTime() < now.getTime()) {
          total += record.outOf;
          score += record.score;
        } else {
          // skip
        }
      });
      if (total <= 0) {this.percentage = 0} else {
        this.percentage = score / total;
      }
    });
  }

  getPercent() {
    return this.percentage;
  }
}
