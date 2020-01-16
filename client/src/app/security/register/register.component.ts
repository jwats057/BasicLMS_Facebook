import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import { Router } from '@angular/router';
import * as Countries from '../../models/countries';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      fname: [null, Validators.required],
      lname: [null, Validators.required],
      email: [null, [Validators.email, Validators.required]],
      country: [null, [Validators.required, Validators.min(0)]],
      phone: [null, [Validators.required]],
    });
  }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    this.userServices.addStudent({
      // key: '0', /////////////////////// debug value change it! to facebook id value
      // token: 'token', /////////////////////////////// same story here
      key: this.userServices.fbUser().id,
      token: this.userServices.fbUser().token,
      email: this.registerForm.value.email,
      fname: this.registerForm.value.fname,
      lname: this.registerForm.value.lname,
      phone: this.getCountries().find( (x) => x.name === this.registerForm.value.country).dial_code + this.registerForm.value.phone,
      country: this.registerForm.value.country,
    });
    //   .subscribe( (resp) => {
    //   if (resp) {
    //     this.router.navigateByUrl('/');
    //     this.loading = false;
    //   }
    // });
  }

  getCountries() {
    return Countries.countries;
  }
}
