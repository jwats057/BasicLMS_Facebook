import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {UserModel} from '../models/usermodel.models';
import {Router} from '@angular/router';
import {catchError, distinctUntilChanged, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';
import {UsertypeModel} from '../models/usertype.model';

declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isLoggedIn = false;
  private subscriptions: Subscription[] = [];
  FBLoggedIn;
  private userModel: UserModel = new UserModel();
  // tslint:disable-next-line:variable-name
  private student_id: string; // debugging value
  private admin: {id: string, name: string};
  private auth = 0;

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router) {
    const jwtToken = this.getToken();
    this.FBLoggedIn = new BehaviorSubject<boolean>(!!jwtToken);
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: '398974807682335',
        cookie: true,
        xfbml: true,
        version: 'v4.0'
      });
      FB.AppEvents.logPageView();
      this.loadUser();
      if (this.getToken()) {
          // this.getCurrentUser();
      }
    };

    // tslint:disable-next-line:only-arrow-functions
    ( function(d, s, id) {
      // tslint:disable-next-line:one-variable-per-declaration prefer-const
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  loadUser() {
    if (this.cookies.check('admin-session') && this.isTokenFresh(this.cookies.get('admin-session')) ||
        this.cookies.check('fb-token') && this.isTokenFresh(this.cookies.get('fb-token'))) {
      // ||
        // this.isLoggedFacebookLoggedIn()) {
      this.isLoggedIn = true;
      return true;
    } else {
      this.isLoggedIn = false;
      return false;
    }
  }

  isLoggedFacebookLoggedIn() {
    FB.getLoginStatus( (response) => {
      if (response.status === 'connected') {
        console.log('HERE!!!', response);
        this.isLoggedIn = true;
        this.userModel.id = response.authResponse.userID;
      } else {
        this.isLoggedIn = false;
      }
      console.log(this.userModel);
      return this.isLoggedIn;
    });
  }

  resetUserModel() {
    if (this.getToken()) {
      this.isLoggedIn = true;
      this.subscriptions.push(this.getCurrentUser().subscribe((userInfo: UserModel) => {
        this.userModel = userInfo;
        console.log(this.userModel);
      }));
    }
  }

  isTokenFresh(token: string) {
    try {
      const decoded = jwt_decode(token);
      if (!decoded.exp) { throw false; }
      console.log(decoded);
      this.auth = decoded.auth;
      if (decoded.exp < Date.now().valueOf() / 1000) {
        throw false;
      } else {
        const name: string[] = decoded.name.split(' ');
        console.log(name);
        this.userModel.id = decoded.id;
        this.userModel.first_name = name[0];
        this.userModel.last_name = name[1] || '';
        this.userModel.type = decoded.auth;
        console.log(this.userModel);
        return true;
      }
    } catch (err) {
      return err;
    }
  }

  Adminlogin(loginData) {
    let options = new HttpParams();
    options = options.append('username', loginData.username);
    options = options.append('password', loginData.password);
    return this.http.post(`${environment.apiAddress}/users/admin-login`, loginData).pipe(
      distinctUntilChanged(),
      tap((jwt: any) => {
        this.cookies.set('admin-session', jwt.payload, 2, '/');
        this.isTokenFresh(jwt.payload);
        this.isLoggedIn = true;
      }),
      catchError(this.handleError('adminLogin'))
    );
  }

  getToken(): string {
    return window.localStorage.jwtToken;
  }

  saveToken(token: string) {
    window.localStorage.jwtToken = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  submitLogin() {
    FB.login(result => {
      console.log(result);
      const params = {params: new HttpParams().set('userID', result.authResponse.userID)};
      console.log('RESULT.AUTHRESPONSE:  ', result.authResponse);
      FB.api('/me', {fields: 'first_name, last_name, email'}, response => {
        console.log('this is the response:', response);
        
        this.userModel.id = response.id;
        this.userModel.first_name = response.first_name;
        this.userModel.last_name = response.last_name;
        this.userModel.email = response.email;
        this.userModel.type = UsertypeModel.Student;
        
        console.log(this.userModel);
        console.log('Good to see you, ' + response.first_name + '  ' + response.last_name + '    .' + response.email);
      });
      if (result.authResponse) {
        this.http.post(`${environment.apiAddress}/security/auth/facebook`, params)
          .subscribe((response: any) => {
            console.log('POST RESPONSE', response);
            this.saveToken(response.token);
            this.cookies.set('fb-token', response.token, 2, '/');
            this.FBLoggedIn.next(true);
            this.isLoggedIn = true;
          });
      }
    }, {scope: 'email', return_scopes: true});
  }

  getUserInfo(key) {
    const params = {params: new HttpParams().set('key', `${key}`)};
    return this.http.get(`${environment.apiAddress}/users/get-user-info`, params);
  }

  // redirectStudent(user) {
  //   console.log('IN REDIRECT STUDENT');
  //   console.log(user);
  //   this.existingStudent(user).subscribe((resp: boolean) => {
  //     console.log(resp);
  //     if (resp) {
  //       this.getCurrentUser().subscribe((response: any) => {
  //         console.log('IN REDIRECT STUDENT -> GET CURRENT USER   ', response);
  //         this.studentID = response.userID;
  //         this.userModel = response.user_info;
  //         if (!response.userID) {
  //           console.log('USER INFO CANNOT BE FOUND');
  //         } else {
  //           console.log(this.studentID);
  //           console.log('USER', this.userModel);
  //         }
  //       });
  //       return this.userModel;
  //     } else {
  //     // this.addUser(this.userModel);
  //     }
  //   });
  // }

  // existingStudent(user) {
  //   const opts = {
  //     headers:  this.buildHeaders(),
  //     userID: user
  //   };
  //   console.log('IN EXISTING STUDENT', opts);
  //   return this.http.post(`${environment.apiAddress}/users/existing-student`, opts);
  // }

  logout() {
    // tslint:disable-next-line:triple-equals
    if (this.cookies.getAll() != {}) {
      this.cookies.deleteAll('/');
    }
    this.userModel = new UserModel();
    this.isLoggedIn = false;
    console.log(this.userModel);
    this.isLoggedIn = false;
    this.auth = -1;
    this.router.navigate(['/nav/home']);
    localStorage.removeItem('id_token');
    this.destroyToken();
  }

  getIsLoggedIn() {
      return this.isLoggedIn;
  }

  getCurrentUser() {
  return this.http.get(`${environment.apiAddress}/security/auth/me`);
}

  isUsernameAvailable(username) {
    return this.http.post(`${environment.apiAddress}/users/available-username`, {username});
  }

  addUser(userModel) {
    const opts = {
      body: userModel
    };
    console.log(opts);
    this.http.post(`${environment.apiAddress}/users/add-user`, opts).subscribe((result: any) => {
      console.log(result);
    });
  }

  updateUser(userModel) {
    const opts = {
      body: userModel
    };
    console.log(opts);
    this.http.post(`${environment.apiAddress}/users/update-user`, opts).subscribe((result: any) => {
      console.log(result);
    });
  }

  addCoin() {
    return this.http.post(`${environment.apiAddress}/users/test-coin`, {student: this.userModel.id});
  }

  updateStudent(userModel) {
    const opts = {
      body: userModel
    };
    console.log(opts);
    this.http.post(`${environment.apiAddress}/users/update-student`, opts).subscribe((result: any) => {
      console.log(result);
    });
  }

  addInstructor(user) {
    return this.http.post(`${environment.apiAddress}/users/add-instructor`, {user});
  }

  addStudent(user) {
    const opts = {
      body: user
    };
    console.log(opts);
    return this.http.post(`${environment.apiAddress}/users/add-student`, opts).subscribe((result: any) => {
      console.log(result);
    });
  }

  fbUser() {
    return this.userModel;
  }

  getIsAdmin() {
    return this.isLoggedIn && this.userModel.type < UsertypeModel.Guest;
  }

  fbLoggedIn() {
    return this.FBLoggedIn;
  }

  getAuth() {
    return this.userModel.type;
  }

  private handleError<T>(operation = 'operation', result ?: T) {
    return (err: any): Observable<T> => {
      throw err;
    };
  }
}
