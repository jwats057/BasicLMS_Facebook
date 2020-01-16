import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private subscription: Subscription[];
  error = '';
  type = 'password';
  loading: any;
  username: string;
  password: string;
  invalidCredentials = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userServices: UserService
  ) { }

  async ngOnInit() {
    this.subscription = [];
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  authenticateUser() {
    const authUser = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.subscription.push(
       this.userServices.Adminlogin(authUser)
         .subscribe(
           (payload) => {
             console.log(payload);
             this.router.navigateByUrl('');
           },
           (err) => {
             if (err.status === 401) {
               this.invalidCredentials = true;
             }
           })
     );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((item) => {
        item.unsubscribe();
      });
    }
  }
}
