import { DiscussionEditorComponent } from './discussion-editor/discussion-editor.component';
import { MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { CoursesService } from '../../../services/courses.service';
import { IPost } from './../../../models/courses.models';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

const POST_PER_PAGE = 50;

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DiscussionComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  // discussion variables
  id: string;                 // discussin id
  title: string;              // discussion title
  description: string;        // discussion description HTML format
  posts: IPost[] = [];         // discussion posts
  isClosed = false;   // discussion isClosed
  today: Date = new Date();
  endDate: Date = this.today;

  // pagination variables
  totalPosts = 0;
  startFrom = 0;

  // rich text editor input
  replying = false;
  htmlContent = '';

  loading = true;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_course') current_course: string;
  constructor(
    private route: ActivatedRoute,
    private coursesServices: CoursesService,
    private userServices: UserService,
    private router: Router,
    private dialog: MatDialog,
    // private adminServices: AdminService
    ) {}

  openEditDiscussionDialog() {
    const dialogRef = this.dialog.open(DiscussionEditorComponent, {
      width: '90%',
      data: {course: this.current_course, id: this.id, title: this.title,
        description: this.description, isClosed: this.isClosed, endDate: this.endDate},
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.subscriptions.push(this.coursesServices.getDiscussionInfo(this.current_course, this.id)
        .subscribe( (resp: {title: any, description: any, isClosed: any, endDate: string}) => {
          this.description = resp.description;
          this.title = resp.title;
          this.isClosed = resp.isClosed;
          this.endDate = new Date(resp.endDate);
        }));
      }
    }));
  }

  // runs when this component is loaded, gets parameters from url
  ngOnInit() {
    this.loading = true;
    this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
      if (params.discussion) {
        this.id = params.discussion;
      }
      if (params.start) {
        this.startFrom = Number(params.start);
      }
    }));
    this.loadDiscussion();
    this.subscriptions.push(this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.loading = true;
        this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
          if (params.discussion) {
            this.id = params.discussion;
          }
          if (params.start) {
            this.startFrom = Number(params.start);
          } else {
            this.startFrom = 0;
          }
        }));
        this.loadDiscussion();
      }
    }));
  }

  // adds post to discussion and reloads posts
  pushPost() {
    const post = {
      user_id: this.userServices.fbUser().id,
      user_name: this.userServices.fbUser().first_name + ' ' + this.userServices.fbUser().last_name,
      date: new Date().getTime(),
      post: this.htmlContent
    };
    this.subscriptions.push(this.coursesServices.postDiscussionPost(this.current_course, this.id, post)
      .subscribe( (resp) => {
        console.log(resp);
        if (resp) {
        this.totalPosts++;
        this.lastPage();
      }
    }));
  }

  // loads discussion information and the current page of posts
  loadDiscussion() {
    this.loading = true;
    this.replying = false;
    this.htmlContent = '';
    this.subscriptions.push(this.coursesServices.getDiscussionInfo(this.current_course, this.id)
      .subscribe( (resp: {title: any, description: any, isClosed: any, endDate: string}) => {
      this.description = resp.description;
      this.title = resp.title;
      this.isClosed = resp.isClosed;
      this.endDate = new Date(resp.endDate);
    }));
    // tslint:disable-next-line:max-line-length
    this.subscriptions.push(this.coursesServices.getDiscussionPosts(this.current_course, this.id, this.startFrom)
      .subscribe( (resp: {posts: IPost[], total: number}) => {
      if (resp.posts.length > 0) {
        this.posts = resp.posts;
        this.totalPosts = resp.total;
      }
      this.loading = false;
    }));
  }

  isLate() {
    return this.today.getTime() > this.endDate.getTime();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  // allows the new post editor to display
  openEditor() {
    this.replying = true;
  }

  // disables the new post editor to display
  closeEditor() {
    this.replying = false;
  }

  // true is post is empty
  isPostEmpty() {
    return this.htmlContent === '';
  }

  // can only go to a previous page if current start position is not in the first page.
  canBack() {
    return this.startFrom >= POST_PER_PAGE;
  }

  // navigates to the previous discussion posts page
  back() {
    this.startFrom += -(POST_PER_PAGE);
    this.setParams();
  }

  // true if not on first page
  canNext() {
    return (this.startFrom + POST_PER_PAGE) < this.totalPosts;
  }

  // navigates to next page of discussion posts
  next() {
    this.startFrom += (POST_PER_PAGE);
    this.setParams();
  }

  // navigates to first page of discussion posts
  firstPage() {
    this.startFrom = 0;
    this.setParams();
  }

  // navigates to the last page of discussion posts
  lastPage() {
    this.startFrom = Math.trunc(this.totalPosts / POST_PER_PAGE) * POST_PER_PAGE;
    this.setParams();
  }

  // sets the parameters for navigation and reloads the discussion
  setParams() {
    this.router.navigate(['/nav/courses/view-course'], { queryParams:
        {course: this.current_course, select: 'Discussion', discussion: this.id, start: this.startFrom} });
    this.loadDiscussion();
  }
}
