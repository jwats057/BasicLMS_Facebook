import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {UserModel} from '../../../models/usermodel.models';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {
  loading = true;
  userInfo: UserModel;
  constructor(private userService: UserService) {
    this.userService.resetUserModel();
  }

  ngOnInit() {
    this.loading = true;
    this.userInfo = this.userService.fbUser();
    this.loading = false;
  }

}
