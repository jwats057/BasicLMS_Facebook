import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatCardModule,
  MatTableModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatStepperModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatProgressBarModule,
  MatMenuModule,
  MatSnackBarModule,
  MatAutocompleteModule
} from '@angular/material';

import { CoursesRoutingModule } from './courses-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course/course.component';
import { CoursesComponent, NotifyEnrolledComponent, NotifyInClassComponent, NotifyInWaitingComponent } from './courses/courses.component';
import { ModulesComponent } from './course/modules/modules.component';
import { GradesComponent } from './course/grades/grades.component';
import { DiscussionsComponent } from './course/discussions/discussions.component';
import { InfoComponent } from './course/info/info.component';
import { DiscussionComponent } from './course/discussion/discussion.component';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';

//import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { AngularEditorModule} from '@kolkov/angular-editor';
import { AssessmentComponent } from './assessment/assessment.component';
import { DiscussionEditorComponent } from './course/discussion/discussion-editor/discussion-editor.component';
import { NewDiscussionComponent } from './course/discussions/new-discussion/new-discussion.component';
import { CourseDetailEditorComponent } from './course/info/course-detail-editor/course-detail-editor.component';
import { NewContentComponent } from './course/modules/new-content/new-content.component';
import { ModuleEditorComponent } from './course/modules/module-editor/module-editor.component';
import { NewExternalLinkComponent } from './course/modules/new-content/new-external-link/new-external-link.component';
import { NewEmbeddedVideoComponent } from './course/modules/new-content/new-embedded-video/new-embedded-video.component';
import { NewPageComponent } from './course/modules/new-content/new-page/new-page.component';
import { NewQuizComponent } from './course/modules/new-content/new-quiz/new-quiz.component';
import { DocumentViewerComponent } from './course/document-viewer/document-viewer.component';
import { RollcallComponent } from './course/rollcall/rollcall.component';
import { PagesComponent } from './course/pages/pages.component';
import { ConfirmEnrollComponent } from './course/confirm-enroll/confirm-enroll.component';
import { EnrollDialogComponent } from './course/confirm-enroll/enroll-dialog/enroll-dialog.component';
import { GradeReportsComponent } from './course/grade-reports/grade-reports.component';
import { QuizResultComponent } from './assessment/quiz-result/quiz-result.component';
import { QuizDialogComponent } from './course/modules/quiz-dialog/quiz-dialog.component';
import { AnnouncementsComponent } from './course/announcements/announcements.component';
import { NewAnnouncementComponent } from './course/announcements/new-announcement/new-announcement.component';
import { SequenceComponent } from './course/sequence/sequence.component';
import { StepComponent } from './course/sequence/step/step.component';



@NgModule({
  declarations: [
    CourseComponent,
    CoursesComponent,
    ModulesComponent,
    GradesComponent,
    DiscussionsComponent,
    InfoComponent,
    DiscussionComponent,
    AssessmentComponent,
    DiscussionEditorComponent,
    NewDiscussionComponent,
    CourseDetailEditorComponent,
    NewContentComponent,
    ModuleEditorComponent,
    NewExternalLinkComponent,
    NewEmbeddedVideoComponent,
    NewPageComponent,
    NewQuizComponent,
    DocumentViewerComponent,
    RollcallComponent,
    PagesComponent,
    ConfirmEnrollComponent,
    EnrollDialogComponent,
    GradeReportsComponent,
    QuizResultComponent,
    QuizDialogComponent,
    NotifyEnrolledComponent,
    NotifyInClassComponent,
    NotifyInWaitingComponent,
    AnnouncementsComponent,
    NewAnnouncementComponent,
    SequenceComponent,
    StepComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatTableModule,
    AngularEditorModule,
    FormsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    //NgxDocViewerModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatAutocompleteModule
  ],
  exports: [CourseDetailEditorComponent],
  entryComponents: [
    DiscussionEditorComponent,
    NewDiscussionComponent,
    NewAnnouncementComponent,
    CourseDetailEditorComponent,
    ModuleEditorComponent,
    NewContentComponent,
    EnrollDialogComponent,
    QuizDialogComponent,
    NotifyEnrolledComponent,
    NotifyInClassComponent,
    NotifyInWaitingComponent
  ]
})
export class CoursesModule { }
