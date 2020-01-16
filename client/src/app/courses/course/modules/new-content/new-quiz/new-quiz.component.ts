import { CoursesService } from 'src/app/services/courses.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewContentComponent } from './../new-content.component';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent implements OnInit {

  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_dialog') current_dialog: MatDialogRef<NewContentComponent>;
  // tslint:disable-next-line:no-input-rename
  @Input('data') data: {course: string, current_module: string};
  @Output() isSubmitting = new EventEmitter<boolean>();
  submitting = false;
  today = new Date();
  newQuizForm: FormGroup;
  newQuestionForm: FormGroup;
  questionsForm: FormGroup;
  enteringQuestion = true;
  answerInvalid = false;
  items: {question: string, value: number, options: string[], answer: number}[] = [];

  constructor(private formBuilder: FormBuilder,
              private coursesServices: CoursesService) {
    this.newQuizForm = this.formBuilder.group({
      title: ['', Validators.required],
      isTimed: [false, Validators.required],
      time: [{value: 10, disabled: true}, [Validators.min(1), Validators.required]],
      noDueDate: [true, Validators.required],
      dueDate: [{value: this.today, disabled: false}, Validators.required],
      isUnlimited: [true, Validators.required],
      attempts: [{value: 1, disabled: false}, [Validators.min(1), Validators.required]],
      coins: [0, [Validators.required, Validators.min(0)]]
    });
    this.newQuestionForm = this.formBuilder.group({
      question: ['', Validators.required],
      value: [1, [Validators.min(0), Validators.required]],
      answer: [null, [Validators.required, Validators.min(1), Validators.max(4)]],
      A: ['', Validators.required],
      B: ['', Validators.required],
      C: [''],
      D: [''],
    });
    this.questionsForm = this.formBuilder.group({
      hasQuestion: [ false, Validators.requiredTrue ]
    });
  }

  ngOnInit() {}

  timeCheck() {
    if (!this.newQuizForm.value.isTimed) {
      this.newQuizForm.controls.time.enable();
    } else { this.newQuizForm.controls.time.disable(); }
  }

  attemptsCheck() {
    if (!this.newQuizForm.value.isUnlimited) {
      this.newQuizForm.controls.attempts.enable();
    } else { this.newQuizForm.controls.attempts.disable(); }
  }

  dueCheck() {
    if (!this.newQuizForm.value.noDueDate) {
      this.newQuizForm.controls.dueDate.enable();
    } else { this.newQuizForm.controls.dueDate.disable(); }
  }

  addItem() {
    const newItem = {
      question: this.newQuestionForm.value.question,
      value: this.newQuestionForm.value.value,
      answer: this.newQuestionForm.value.answer,
      options: [this.newQuestionForm.value.A, this.newQuestionForm.value.B],
    };
    if (this.newQuestionForm.value.C) { newItem.options.push(this.newQuestionForm.value.C); }
    if (this.newQuestionForm.value.D) { newItem.options.push(this.newQuestionForm.value.D); }
    if (newItem.answer > newItem.options.length) {
      this.answerInvalid = true;
      return null;
    } else {
      this.answerInvalid = false;
    }
    this.items.push(newItem);
    this.questionsForm.controls.hasQuestion.setValue(true);
    this.newQuestionForm.reset();
    this.newQuestionForm.controls.value.setValue(1);
    this.newQuestionForm.controls.answer.setValue(1);
    this.enteringQuestion = false;
  }

  pushQuiz() {
    const newQuiz = {
      title: this.newQuizForm.value.title,
      time: this.newQuizForm.value.isTimed ? this.newQuizForm.value.time : -1,
      dueDate: !this.newQuizForm.value.noDueDate ? null : this.newQuizForm.value.dueDate,
      attempts: !this.newQuizForm.value.isUnlimited ? 'unlimited' : this.newQuizForm.value.attempts,
      items: this.items,
      coins: this.newQuizForm.value.coins,
    };
    this.submitting = true;
    this.isSubmitting.emit(true);
    this.coursesServices.newQuizPush(this.data.course, this.data.current_module, newQuiz).subscribe( (resp) => {
      if (resp) {
        this.current_dialog.close(resp);
      }
      this.submitting = false;
      this.isSubmitting.emit(false);
    });
    console.log(newQuiz);
  }

  removeItem(itemIndex) {
    this.items.splice(itemIndex);
    if (this.items.length < 1) {
      this.questionsForm.controls.hasQuestion.setValue(false);
    } else {
      this.questionsForm.controls.hasQuestion.setValue(true);
    }
  }

  onNoClick() {
    this.current_dialog.close();
  }

  getLetter(index) {
    console.log(index);
    return String.fromCharCode(65 + Number(index));
  }
}
