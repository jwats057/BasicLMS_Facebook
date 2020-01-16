import { CoursesModule } from './../courses/courses.module';
import { CourseDetailEditorComponent } from './../courses/course/info/course-detail-editor/course-detail-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule, MatButtonModule, MatExpansionModule, MatToolbarModule} from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { ViewLogsComponent } from './view-logs/view-logs.component';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';

@NgModule({
  declarations: [DashboardComponent, ViewLogsComponent, ManageCoursesComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    CoursesModule
  ],
  entryComponents: [CourseDetailEditorComponent]
})
export class DashboardModule { }
