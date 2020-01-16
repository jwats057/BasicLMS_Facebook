import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenInterceptorService implements HttpInterceptor {
  constructor(
    private cookies: CookieService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.cookies.check('admin-session')) {
      const jwt = this.cookies.get('admin-session');
      const modifiedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      });
      return next.handle(modifiedRequest);
    } else {
      const jwtToken = window.localStorage.jwtToken;
      if (jwtToken) {
        const modifiedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${jwtToken}`
          }
        });
        return next.handle(modifiedRequest);
      } else {
        return next.handle(req);
      }
    }
  }
}
