import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { ManageResearchComponent } from './pages/manage-research/manage-research.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    ManageResearchComponent,
    DashboardComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, NgChartsModule],
})
export class AdminModule {}
