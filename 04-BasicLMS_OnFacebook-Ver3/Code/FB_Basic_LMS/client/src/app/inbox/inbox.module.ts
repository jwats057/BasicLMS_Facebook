import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox/inbox.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { ConversationComponent } from './inbox/conversation/conversation.component';
import {MatIconModule} from '@angular/material/icon';
import {InboxRoutingModule} from './inbox-routing.module';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { NewMessageComponent } from './inbox/new-message/new-message.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { NewConversationComponent } from './inbox/conversation/new-conversation/new-conversation.component';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [InboxComponent, ConversationComponent, NewMessageComponent, NewConversationComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    InboxRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AngularEditorModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule
  ],
  exports: [RouterModule],
  entryComponents: [NewMessageComponent, NewConversationComponent]

})
export class InboxModule { }
