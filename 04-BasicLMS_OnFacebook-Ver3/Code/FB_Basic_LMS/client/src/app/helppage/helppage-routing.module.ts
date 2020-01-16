import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HelppageComponent} from './helppage/helppage.component';
import {
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';

const routes: Routes = [
  {path: '', component: HelppageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule]
})
export class HelppageRoutingModule { }
