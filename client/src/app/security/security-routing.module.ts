import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SecurityComponent} from './security/security.component';
import {LoginComponent} from './login/login.component';
import {
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';
import { RegisterComponent } from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {ProfileEditorComponent} from './profile/profile-editor/profile-editor.component';

const routes: Routes = [
  {path: '', component: SecurityComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin-register', component: AdminRegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile-editor', component: ProfileEditorComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule],
  entryComponents: [ProfileEditorComponent]
})

export class SecurityRoutingModule { }
