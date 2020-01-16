import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {PrivacyComponent} from './homepage/privacy/privacy.component';
import {TOSComponent} from './homepage/tos/tos.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'tos', component: TOSComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
