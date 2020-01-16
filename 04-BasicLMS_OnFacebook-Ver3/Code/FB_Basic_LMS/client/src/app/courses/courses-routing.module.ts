import { SequenceComponent } from './course/sequence/sequence.component';
import { ConfirmEnrollComponent } from './course/confirm-enroll/confirm-enroll.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { CoursesComponent } from './courses/courses.component';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { NgModule } from '@angular/core';
import { QuizResultComponent } from './assessment/quiz-result/quiz-result.component';
import { AuthGuard } from '../security/security/auth.guard';
import {DiscussionsComponent} from './course/discussions/discussions.component';

const routes: Routes = [
    {path:'', component: CoursesComponent},
    {path:'view-course', component: CourseComponent, canActivate: [AuthGuard]},
    {path:'assessment', component: AssessmentComponent, canActivate: [AuthGuard]},
    {path:'result', component: QuizResultComponent, canActivate: [AuthGuard]},
    {path:'confirm-enroll', component: ConfirmEnrollComponent, canActivate: [AuthGuard]},
    {path:'conversations', component: DiscussionsComponent, canActivate: [AuthGuard]},
    {path:'seq', component: SequenceComponent},
    {path:'**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoursesRoutingModule {}
