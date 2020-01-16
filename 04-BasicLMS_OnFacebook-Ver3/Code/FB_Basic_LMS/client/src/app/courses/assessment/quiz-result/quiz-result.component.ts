import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Item } from '../assessment.component';
import { CoursesService } from '../../../services/courses.service';
import { UserService } from '../../../services/user.service';

export class Record {
  title: string;
  attempted: number;
  doneOn: Date;
  dueDate: Date;
  outOf: number;
  score: number;
  startTime: Date;
  items: Item[];
}

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent implements OnInit {

  course: string;
  quizId: string;
  barColor = 'primary';
  barMode = 'indeterminate';
  record: Record = {
    title: '',
    attempted: 0,
    doneOn: null,
    dueDate: null,
    outOf: 100,
    score: 100,
    startTime: null,
    items: []
  };

  constructor(
    private routes: ActivatedRoute,
    private courseServices: CoursesService,
    private userServices: UserService
  ) {
  }

  ngOnInit() {
    this.routes.queryParams.subscribe( (params) => {
      if (params.course) {
        this.course = params.course;
      }
      if (params.quiz) {
        this.quizId = params.quiz;
      }
      this.courseServices.getStudentQuizRecord(this.userServices.fbUser().id, this.course, this.quizId).subscribe( (resp: Record) => {
        this.record = resp;
        if (this.getPercent() < 60) { this.barColor = 'warn'; }
        this.barMode = 'determinate';
        console.log(resp);
      });
    });
  }
  getPercent() {
    let percent: number;
    if (this.record.outOf === 0) {
      return 0;
    }
    percent = this.record.score / this.record.outOf * 100;
    return percent;
  }
  // getPercent() {
  //   var percent = 0;
  //   if(this.record.outOf == 0) percent = 0;
  //   percent = this.record.score / this.record.outOf * 100;
  //   return percent;
  // }
}
