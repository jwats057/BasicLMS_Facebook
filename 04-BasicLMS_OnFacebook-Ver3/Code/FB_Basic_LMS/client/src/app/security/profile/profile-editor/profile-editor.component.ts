import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {UserModel} from '../../../models/usermodel.models';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {

  profileEditorForm: FormGroup;
  user: UserModel;
  loading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<ProfileEditorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {id: string, first_name: string, last_name: string, email: string,
      phone: string, country: string}) {
    console.log(data.id);
    this.profileEditorForm = this.formBuilder.group({
      id: this.userServices.fbUser().id,
      first_name: [this.userServices.fbUser().first_name, Validators.required],
      last_name: [this.userServices.fbUser().last_name, Validators.required],
      email: [this.userServices.fbUser().email, [Validators.email, Validators.required]],
      phone: [this.userServices.fbUser().phone, Validators.required],
      country: [this.userServices.fbUser().country, Validators.required]
    });
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    outline: true,
    sanitize: false,
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  updateProfile() {
    this.loading = true;
    this.userServices.updateUser( {
      userID: this.profileEditorForm.value.id,
      email: this.profileEditorForm.value.email,
      first_name: this.profileEditorForm.value.first_name,
      last_name: this.profileEditorForm.value.last_name,
      phone: this.profileEditorForm.value.phone,
      country: this.profileEditorForm.value.country,
      photo: this.userServices.fbUser().photo,
      photoToken: this.userServices.fbUser().photoToken,
    });
    this.userServices.updateStudent( {
      key: this.profileEditorForm.value.id,
      email: this.profileEditorForm.value.email,
      fname: this.profileEditorForm.value.first_name,
      lname: this.profileEditorForm.value.last_name,
      phone: this.profileEditorForm.value.phone,
      country: this.profileEditorForm.value.country,
      photo: this.userServices.fbUser().photo,
      photoToken: this.userServices.fbUser().photoToken,
      token: 'Student'
    });
    this.loading = false;
    this.dialogRef.close();

  }
  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit() {}

}
