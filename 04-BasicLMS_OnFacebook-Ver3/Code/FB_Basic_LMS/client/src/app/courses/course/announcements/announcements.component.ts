import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Announcement} from '../../../models/courses.models';
import {Subscription} from 'rxjs';
import {CoursesService} from '../../../services/courses.service';
import {UserService} from '../../../services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {NewAnnouncementComponent} from './new-announcement/new-announcement.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AnnouncementsComponent implements OnInit, OnChanges {

  Announcement: Announcement[] = [];
  subscriptions: Subscription[] = [];
  @Input('current_course') current_course: string;

  constructor(
    private coursesServices: CoursesService,
    private userServices: UserService,
    private dialog: MatDialog,
  ) { }

  openAnnouncementsDialog() {
    const dialogRef =  this.dialog.open(NewAnnouncementComponent, {
      width: '90%',
      data: this.current_course
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.loadAnnouncements();
        console.log(result);
      }
    }));
  }

  // Runs whenever this component is loaded
  ngOnInit() {
    this.loadAnnouncements();
  }

  // Loads announcements id, title, and description
  loadAnnouncements() {
    this.subscriptions.push(this.coursesServices.getAnnouncements(this.current_course).subscribe( (resp: Announcement[]) => {
      this.Announcement = resp;
    }));
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  // Runs whenever input values change
  ngOnChanges() {
    this.ngOnInit();
  }
}
