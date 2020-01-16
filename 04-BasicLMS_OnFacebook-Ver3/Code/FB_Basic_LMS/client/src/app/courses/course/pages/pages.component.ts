import { CoursesService } from 'src/app/services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Page } from '../../../models/courses.models';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  subscriptions: Subscription[] = [];

  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_course') current_course: string;
  // tslint:disable-next-line:variable-name
  current_page = '';
  // tslint:disable-next-line:variable-name
  module_id = '';
  page: Page = { title: '', page: ''};

  constructor(
    private route: ActivatedRoute,
    private coursesServices: CoursesService) {}

  ngOnInit() {
    this.subscriptions.push(this.route.queryParams.subscribe( params => {
      if (params.page_id) {
        this.current_page = params.page_id;
      }
      if (params.module) {
        this.module_id = params.module;
      }
    }));

    console.log(this.current_course, this.current_page, this.module_id);
    this.subscriptions.push(this.coursesServices.getPage(this.current_course, this.module_id, this.current_page)
      .subscribe( (resp: Page) => {
        this.page = resp;
      }));
  }
}
