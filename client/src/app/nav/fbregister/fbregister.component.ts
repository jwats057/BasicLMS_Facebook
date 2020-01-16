import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../models/usermodel.models';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fbregister',
  templateUrl: './fbregister.component.html',
  styleUrls: ['./fbregister.component.scss']
})
export class FBRegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: UserModel;
  loading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<FBRegisterComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {id: string, first_name: string, last_name: string, email: string}) {
    console.log(data.id);
    this.registerForm = this.formBuilder.group({
      id: data.id,
      first_name: [data.first_name, Validators.required],
      last_name: [data.last_name, Validators.required],
      email: [data.email, [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      country: ['', Validators.required]
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

  register() {
    this.loading = true;
    this.userServices.addUser( {
          userID: this.registerForm.value.id,
          email: this.registerForm.value.email,
          first_name: this.registerForm.value.first_name,
          last_name: this.registerForm.value.last_name,
          phone: this.registerForm.value.phone,
          country: this.registerForm.value.country
        });
    this.userServices.addStudent( {
      key: this.registerForm.value.id,
      email: this.registerForm.value.email,
      fname: this.registerForm.value.first_name,
      lname: this.registerForm.value.last_name,
      phone: this.registerForm.value.phone,
      country: this.registerForm.value.country,
      token: 'Student'
    });
    this.loading = false;
    this.dialogRef.close();

  }

  ngOnInit() {}
}
