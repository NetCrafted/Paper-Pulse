import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { UploadPaperComponent } from './pages/upload-paper/upload-paper.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RejectedResearchComponent } from './pages/rejected-research/rejected-research.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaperDetailComponent } from './pages/paper-detail/paper-detail.component';

@NgModule({
  declarations: [
    UserHomeComponent,
    BrowseComponent,
    UploadPaperComponent,
    ProfileComponent,
    RejectedResearchComponent,
    PaperDetailComponent,
  ],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, FormsModule],
})
export class UserModule {}
