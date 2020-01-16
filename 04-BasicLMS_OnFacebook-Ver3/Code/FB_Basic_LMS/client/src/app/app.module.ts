/* Angular */
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

/* Styling */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatSortModule,
  MatSelectModule,
  MatDialogModule} from '@angular/material';

/* Services */
import { UserService } from './services/user.service';

/* Routing */
import { AppRoutingModule } from './app-routing.module';

/* App Components */
import { AppComponent } from './app.component';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { JwtTokenInterceptorService } from './jwt-token.interceptor';
import {EnsureHttpsInterceptorModule} from 'angular-interceptors';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ContextComponent } from './context/context.component';

@NgModule({
  declarations: [
    AppComponent,
    YesNoDialogComponent,
    ContextComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    HomeModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule,
    EnsureHttpsInterceptorModule.forRoot(),
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  providers: [
    UserService,
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [YesNoDialogComponent, ContextComponent],
})
export class AppModule { }
