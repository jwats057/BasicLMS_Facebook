import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  loading = true;
  constructor(private userService: UserService) {
    this.userService.resetUserModel();
  }

  ngOnInit() {}

  getUser() {
    return this.userService.fbUser();
  }

}
