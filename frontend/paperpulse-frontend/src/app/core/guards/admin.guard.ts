import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    if (authService.isAdmin()) {
      return true;
    } else {
      router.navigate(['/user/home']);
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }
};
