import {Component, OnChanges, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CoursesService} from '../../services/courses.service';
import {Conversation} from '../../models/courses.models';
import {MatDialog} from '@angular/material/dialog';
import {NewMessageComponent} from './new-message/new-message.component';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnChanges {

  conversations: Conversation[] = [];
  currentConversation: Conversation;
  conversation = {id: ''};
  // tslint:disable-next-line:variable-name
  private user_id: string;
  // tslint:disable-next-line:variable-name
  current_course = '';
  course = {name: '', id: this.current_course, description: '', instructor: ''};
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  openConversationDialog() {
    this.loadData();
    const dialogRef =  this.dialog.open(NewMessageComponent, {
      width: '90%',
      data: this.conversation
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.loadConversations();
        console.log(result);
      }
    }));
  }

  ngOnInit() {
    this.loadData();
    this.loadConversations();
    console.log(this.conversations);
  }

  loadData() {
    this.user_id = this.userServices.fbUser().id;
    if (this.user_id) {
      this.subscriptions.push(this.coursesServices.getCourseInfo(this.current_course).subscribe((course: {
          id: string, name: string, description: string, instructor: string, students: string[]}) => {
          this.course = course;
          console.log(this.course);
        }));
    }
  }

  loadConversations() {
    console.log(this.course.name);
    this.subscriptions.push(this.coursesServices.getConversations().subscribe( (resp: Conversation[]) => {
      this.conversations = resp;
      console.log(this.conversations);
    }));
  }

  async onSetCurrentConversation(c: any) {
    console.log(c);
    this.coursesServices.getDiscussionInfo(c.courseId, c.id).subscribe( (result) => {
      console.log(result);
    });
    this.currentConversation = c;
    console.log(this.currentConversation);
  }

  ngOnChanges() {
    this.ngOnInit();
  }

}
