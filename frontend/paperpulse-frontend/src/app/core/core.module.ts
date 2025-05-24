import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [FooterComponent, NavbarComponent, HomeComponent],
  imports: [CommonModule, CoreRoutingModule],
  exports: [NavbarComponent, FooterComponent, HomeComponent],
})
export class CoreModule {}
