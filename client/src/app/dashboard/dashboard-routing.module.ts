import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import { ViewLogsComponent } from './view-logs/view-logs.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'logs', component: ViewLogsComponent},
  {path: 'manager', component: ManageCoursesComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
