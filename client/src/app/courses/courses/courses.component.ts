import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../../services/courses.service';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { YesNoDialogComponent } from 'src/app/yes-no-dialog/yes-no-dialog.component';
const COURSE_PER_PAGE = 10;
const letters = /^[A-Za-z]*$/;


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  courses = []; // the user's courses names and id
  private startFrom = 0;
  private sort = 'name';
  private size = 0;
  currentCategory = 'null';
  loading = false;
  search = '';
  predicting = false;
  predictions: string[] = [];
  searching = false;
  onlyOpen = false;


  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router,
    private dialog: MatDialog,
    private routing: ActivatedRoute,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.routing.queryParams.subscribe( params => {
      if (params.start) {
        this.startFrom = params.start;
      } else {
        this.startFrom = 0;
      }
      if (params.category) {
        this.currentCategory = params.category;
      } else {
        this.currentCategory = null;
      }
      if (params.sort) {
        this.sort = params.sort;
      } else {
        this.sort = 'name';
      }
      if (params.search) {
        this.search = params.search;
        this.searching = true;
      } else {
        this.search = null;
        this.searching = false;
      }
      if(params.open) {
        this.onlyOpen = params.open == true ? true : false;
      } else { this.onlyOpen = false;}
    });
    this.fetchPage();
    this.subscriptions.push(this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.routing.queryParams.subscribe( params => {
          if (params.start) {
            this.startFrom = params.start;
          } else {
            this.startFrom = 0;
          }
          if (params.category) {
            this.currentCategory = params.category;
          } else {
            this.currentCategory = null;
          }
          if (params.sort) {
            this.sort = params.sort;
          } else {
            this.sort = 'name';
          }
          if (params.search) {
            this.search = params.search;
            this.searching = true;
          } else {
            this.search = null;
            this.searching = false;
          }
          if(params.open) {
            this.onlyOpen = params.open;
          } else { this.onlyOpen = false;}
        });
        this.fetchPage();
      }
    }));
  }

  fetchPage() {
    this.loading = true;
    if (this.currentCategory != null && this.currentCategory !== 'null') {
      console.log('browsing by category');
      this.coursesServices.getCoursesCatergorySortBy(this.currentCategory, this.sort, this.startFrom, this.onlyOpen)
        .subscribe( (resp: { courses: [], size: number}) => {
        this.size = resp.size;
        this.courses = resp.courses;
        this.loading = false;
      });
    } else if (this.search != null && this.search.length > 1) {
      console.log('browsing by search');
      this.coursesServices.getSearchPage(this.search, this.startFrom).subscribe((resp: { courses: [], size: number}) => {
        this.size = resp.size;
        this.courses = resp.courses;
        this.loading = false;
      });
    } else {
      console.log('browsing normal');
      this.coursesServices.getCoursesSortBy(this.sort, this.startFrom, this.onlyOpen).subscribe( (resp: { courses: [], size: number}) => {
        this.size = resp.size;
        this.courses = resp.courses;
        this.loading = false;
      });
    }
  }

  toggleOpen() {
    this.onlyOpen = !this.onlyOpen;
    this.fetchPage();
  }

  myColor() {
    return this.onlyOpen ? 'warn' : 'primary';
  }

  register(course) {
    this.coursesServices.canRegister(this.userServices.fbUser().id, course)
      .subscribe((resp: {stat: boolean, message: string}) => {
      if (resp.stat) {
        this.coursesServices.tryEnroll(this.userServices.fbUser().id, course).subscribe((result) => {
          if (result) {
            this.snackbar.openFromComponent(NotifyEnrolledComponent, {
              duration: 3 * 1000,
            });
          }
        });
      } else {
        console.log(resp.message);
        if (resp.message === 'Already in class!' || resp.message === 'Already registered!') {
          this.snackbar.openFromComponent(NotifyInClassComponent, {
            duration: 3 * 1000,
          });
        } else if (resp.message === 'Already in waiting-list!') {
          this.snackbar.openFromComponent(NotifyInWaitingComponent, {
            duration: 3 * 1000,
          });
        }
      }
    });
  }

  openFullDialog(course) {
    console.log(course);
    this.coursesServices.canRegister(this.userServices.fbUser().id, course)
      .subscribe((resp: {stat: boolean, message: string}) => {
      if (resp.stat) {
        const dialogRef = this.dialog.open(YesNoDialogComponent, {
          width: '50%',
          data: {
            title: 'Course is Full!',
            message: 'Would you like to be placed in the waiting list?\n\nYou will be notified if you a spot becomes available!'
          }
        });
        dialogRef.afterClosed().subscribe( (response) => {
          if (response) {
            this.register(course);
          }
        });
      } else {
        console.log(resp.message);
      }
    });
  }

  // can only go to a previous page if current start position is not in the first page.
  canBack() {
    return this.startFrom >= COURSE_PER_PAGE;
  }

  // navigates to the previous discussion posts page
  back() {
    this.startFrom += -(COURSE_PER_PAGE);
    this.setParams();
  }

  // true if not on first page
  canNext() {
    return (this.startFrom + COURSE_PER_PAGE) < this.size;
  }

  // navigates to next page of discussion posts
  next() {
    this.startFrom += (COURSE_PER_PAGE);
    this.setParams();
  }

  // navigates to first page of discussion posts
  firstPage() {
    this.startFrom = 0;
    this.setParams();
  }

  // navigates to the last page of discussion posts
  lastPage() {
    if (this.size > COURSE_PER_PAGE) {
      this.startFrom = Math.trunc(this.size / COURSE_PER_PAGE) * COURSE_PER_PAGE;
    }
    console.log(this);
    this.setParams();
  }

  // sets the parameters for navigation and reloads the discussion
  setParams() {
    this.router.navigate(['/nav/courses'], { queryParams:
        {start: this.startFrom, category: this.currentCategory,
          sort: this.sort, search: this.search, open: this.onlyOpen}});
    this.fetchPage();
  }

  getCategories() {
    return this.coursesServices.getAllCategories();
  }

  setCategories(category) {
    this.currentCategory = category;
    this.startFrom = 0;
    this.sort = 'name';
    this.setParams();
  }

  setSort(sort) {
    this.sort = sort;
    this.startFrom = 0;
    //this.currentCategory = 'null';
    this.setParams();
  }

  userLoggedIn() {
    return this.userServices.fbLoggedIn();
  }

  test() {
    console.log(this.search);
  }

  doSearch() {
    this.currentCategory = null;
    this.startFrom = 0;
    this.sort = 'name';
    this.searching = true;

    this.setParams();
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.test();
      this.doSearch();

    } else if ( String.fromCharCode(event.keyCode).match(letters) ) {
      setTimeout(null, 100);
      console.log(this.search);
      this.coursesServices.getPredictions(this.search).subscribe((resp: string[]) => {
        this.predictions = resp;
        console.log(resp);
      });

    } else if (event.keyCode === 32 || event.keyCode === 8) {
      console.log(this.search);
      this.coursesServices.getPredictions(this.search).subscribe((resp: string[]) => {
        this.predictions = resp;
        console.log(resp);
      });

    }
  }
  
  isAdmin() {
    return this.userServices.getIsAdmin();
  }
  
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'notify-enrolled',
  template: '<p>Successfully registered!</p>',
  styles: [`
    p {
      color: light-gray;
    }
  `],
})

export class NotifyEnrolledComponent {}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'notify-enrolled',
  template: '<p>Already Registered!</p>',
  styles: [`
    p {
      color: light-gray;
    }
  `],
})

export class NotifyInClassComponent {}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'notify-enrolled',
  template: '<p>Already in waiting-list!</p>',
  styles: [`
    p {
      color: light-gray;
    }
  `],
})

export class NotifyInWaitingComponent {}
