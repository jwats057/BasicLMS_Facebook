import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';

function equalsValidator(controlA: FormControl) {
  return function innerEqualsValidator(controlB: FormControl) {
    const pass: string = controlA.value;
    const rep: string = controlB.value;
    // tslint:disable-next-line:triple-equals
    if (pass != rep) {
      return 'NOT EQUAL, ' + pass + ' !=' + rep + '!';
    }
    return null;
  };
}

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss']
})
export class AdminRegisterComponent implements OnInit {

  registerForm: FormGroup;
  auth = 0;
  loading = false;
  private password = new FormControl('', [Validators.required]);

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router) {
    this.registerForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      primary: ['', [Validators.email, Validators.required]],
      contact: ['', [Validators.email, Validators.required]],
      pass: this.password,
      check: ['', [Validators.required, equalsValidator(this.password)]],
      auth: [0, [Validators.required]],
    });
  }

  register() {
    this.loading = true;
    this.userServices.isUsernameAvailable(this.registerForm.value.primary).subscribe( (resp: boolean) => {
      if (resp) {
        this.userServices.addInstructor({
          email: this.registerForm.value.primary,
          contactEmail: this.registerForm.value.contact,
          f_name: this.registerForm.value.fname,
          l_name: this.registerForm.value.lname,
          password: this.registerForm.value.pass,
          auth: this.registerForm.value.auth
          // tslint:disable-next-line:no-shadowed-variable
        }).subscribe((response) => {
          if (response) {
            this.router.navigateByUrl('/');
          }
          this.loading = false;
        });
      }
    });
  }

  ngOnInit() {
    // tslint:disable-next-line:variable-name
    const _auth = this.userServices.getAuth();
    this.auth = -1;
    if (_auth < 3) {
      this.auth = _auth;
    }
  }

  getAuth() {
    return this.userServices.getAuth();
  }
}
