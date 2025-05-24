import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginError!: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    const formData = this.loginForm.value;
    this.authService.login(formData).subscribe({
      next: () => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/user/home']);
        }
      },
      error: (error) => {
        const apiErrors = error?.error;
        const firstKey = Object.keys(apiErrors)[0];
        this.loginError = apiErrors[firstKey];
      },
    });
  }
}
