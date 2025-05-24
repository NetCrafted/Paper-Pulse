import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserName(): string {
    return this.authService.getFullName();
  }

  toggleTheme() {
    const body = document.querySelector('body');
    if (body) {
      body.setAttribute(
        'data-theme',
        body.getAttribute('data-theme') === 'light' ? 'dark' : 'light',
      );
    }
  }
}
