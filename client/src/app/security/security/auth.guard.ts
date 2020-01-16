import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private cookies: CookieService,
    private router: Router,
    private userServices: UserService,
) {
    this.userServices.resetUserModel();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const nextPath = next.url[0].path;
    console.log(next.url.toString());
    if (nextPath === 'nav' && next.url[1].path === 'security' && next.url[2].path === 'admin-register'
      && this.userServices.fbUser().type && this.userServices.fbUser().type > 2) {
      this.router.navigate(['/nav/home']);
    } else if (nextPath === 'login' || nextPath === 'nav'
      || nextPath === 'courses' && next.url.length === 1 || nextPath === 'helppage'
      || nextPath === 'home') {
      return true;
      } else {
      // this.userServices.resetUserModel();
      if (this.userServices.getIsLoggedIn() || this.userServices.fbUser().id) {
        console.log(this.userServices.getIsLoggedIn());
        console.log(this.userServices.fbUser().id);
        return true;
      } else {
        this.router.navigate(['/nav/security/register']);
      }
    }
  }
}
