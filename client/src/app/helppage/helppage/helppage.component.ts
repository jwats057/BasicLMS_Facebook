import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-helppage',
  templateUrl: './helppage.component.html',
  styleUrls: ['./helppage.component.scss']
})
export class HelppageComponent implements OnInit {

  admins = [
    {name: 'Danny Rodriguez', phone: '(305)-439-1452', email: 'drodr518@fiu.edu'},
    {name: 'Joao Guiramaes', phone: '(999)-999-9999', email: 'xxxxxx@fiu.edu'}
  ];
  submittedComplaint = '';

  ComplaintSubmitted() {
    this.submittedComplaint = 'Thank you for your submission, we will be contacting you as soon as possible';
  }
  constructor() { }

  ngOnInit() {}

}

