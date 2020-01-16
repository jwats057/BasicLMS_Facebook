import { UserService } from '../../../services/user.service';
import { CoursesService } from '../../../services/courses.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DIscussions } from '../../../models/courses.models';
import { MatDialog } from '@angular/material';
import { NewDiscussionComponent } from './new-discussion/new-discussion.component';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss']
})
export class DiscussionsComponent implements OnInit, OnChanges {

  discussions: DIscussions[] = [];
  subscriptions: Subscription[] = [];
  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_course') current_course: string;
  isPublic: boolean;

  constructor(
    private coursesServices: CoursesService,
    private userServices: UserService,
    private dialog: MatDialog,
    ) {}

  openDiscussionDialog() {
    const dialogRef =  this.dialog.open(NewDiscussionComponent, {
      width: '90%',
      data: this.current_course
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.loadDiscussions();
        console.log(result);
      }
    }));
  }

  // Runs whenever this component is loaded
  ngOnInit() {
     if (this.current_course) {
      this.isPublic = true;
    } else {
      this.isPublic = false;
    }
     this.loadDiscussions();
  }

  // Loads discussions id, title, and description
  loadDiscussions() {
    if (this.isPublic) {
      this.subscriptions.push(this.coursesServices.getDiscussions(this.current_course).subscribe( (resp: DIscussions[]) => {
        this.discussions = resp;
      }));
    } else {
      this.subscriptions.push(this.coursesServices.getConversations().subscribe( (resp: DIscussions[]) => {
        this.discussions = resp;
      }));
    }
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  // Runs whenever input values change
  ngOnChanges() {
    this.ngOnInit();
  }
}
