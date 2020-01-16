import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security/security.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {AdminRegisterComponent} from './admin-register/admin-register.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ProfilePictureComponent } from './profile/profile-picture/profile-picture.component';
import { DetailsComponent } from './profile/details/details.component';
import { ProfileEditorComponent } from './profile/profile-editor/profile-editor.component';
import { ImageUploadComponent } from './profile/profile-editor/image-upload/image-upload.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
  declarations: [SecurityComponent, LoginComponent, RegisterComponent, AdminRegisterComponent, ProfileComponent,
    ProfilePictureComponent, DetailsComponent, ProfileEditorComponent, ImageUploadComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatSelectModule,
    MatToolbarModule,
    AngularEditorModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatTableModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
  ],
  entryComponents: [ProfileEditorComponent]
})
export class SecurityModule { }
