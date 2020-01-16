import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InboxComponent} from './inbox/inbox.component';
import {ConversationComponent} from './inbox/conversation/conversation.component';
import {NewMessageComponent} from './inbox/new-message/new-message.component';
import {AuthGuard} from '../security/security/auth.guard';

const routes: Routes = [
  {path: '', component: InboxComponent, children: [
  {path: 'conversations', component: ConversationComponent, canActivate: [AuthGuard]},
  {path: 'new-message', component: NewMessageComponent, canActivate: [AuthGuard]}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
