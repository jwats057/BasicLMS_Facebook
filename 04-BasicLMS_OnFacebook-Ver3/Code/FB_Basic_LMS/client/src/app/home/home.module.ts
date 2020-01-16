import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import { TOSComponent } from './homepage/tos/tos.component';
import { PrivacyComponent } from './homepage/privacy/privacy.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  declarations: [HomepageComponent, TOSComponent, PrivacyComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatExpansionModule,
    MatToolbarModule
  ]
})
export class HomeModule { }
