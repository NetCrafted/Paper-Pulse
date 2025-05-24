import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './pages/browse/browse.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RejectedResearchComponent } from './pages/rejected-research/rejected-research.component';
import { UploadPaperComponent } from './pages/upload-paper/upload-paper.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { PaperDetailComponent } from './pages/paper-detail/paper-detail.component';

const routes: Routes = [
  { path: 'home', component: UserHomeComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'upload', component: UploadPaperComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'rejected', component: RejectedResearchComponent },
  {
    path: 'papers/:id',
    component: PaperDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
