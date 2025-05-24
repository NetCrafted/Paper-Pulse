import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  passwordForm: FormGroup;
  toastVisible = false;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .post(
        'http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:8000/api/users/change-password/',
        this.passwordForm.value,
        { headers },
      )
      .subscribe({
        next: () =>
          this.showToast('Password updated successfully!', 3000, 'user/home'),

        error: (err) =>
          this.showToast(
            err.error.detail || 'Password update failed.',
            3000,
            '/user/home',
          ),
      });
  }

  deleteAccount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .delete('http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:8000/api/users/delete-account/', { headers })
      .subscribe({
        next: () => {
          localStorage.clear();
          this.showToast('Account deleted', 3000, '');
          // Optionally redirect to login
        },
        error: (err: any) =>
          this.showToast(
            err.error.detail || 'Failed to delete account.',
            3000,
            '/user/home',
          ),
      });
  }

  showToast(message: string, duration: number = 3000, route?: string): void {
    this.toastMessage = message;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
      if (route) {
        this.router.navigate([route]);
      }
    }, duration);
  }
}
