import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  ExtraOptions,
  PreloadAllModules
} from '@angular/router';


const routes: Routes = [
  {path: '', redirectTo: 'nav/home', pathMatch: 'full'},
  {path: 'nav', loadChildren: () => import('./nav/nav.module').then (mod => mod.NavModule), runGuardsAndResolvers: 'always'},
  {path: 'home', loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule)},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)},
  {path: 'student-enroll', loadChildren: () => import('./courses/courses.module').then(mod => mod.CoursesModule)},
  {path: 'admin', redirectTo: '/nav/security/login'},
  {path: '**', redirectTo: 'nav/dashboard'}
];

const config: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  preloadingStrategy: PreloadAllModules,
  onSameUrlNavigation: 'reload',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
