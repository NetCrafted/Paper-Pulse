import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;
  registerError!: string;
  toastMessage!: string;
  toastVisible!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerError = 'Please fill in all required fields correctly.';
      return;
    }

    if (this.registerForm.errors?.['passwordMismatch']) {
      this.registerError = 'Passwords do not match';
      return;
    } else {
      this.registerError = '';
      const formData = this.registerForm.value;

      this.authService.signup(formData).subscribe({
        next: () => {
          this.showToast('Registration successful!');
          // Navigate to the login page after showing the toast
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const apiErrors = error?.error;
          const firstKey = Object.keys(apiErrors)[0];
          const message = Array.isArray(apiErrors[firstKey])
            ? apiErrors[firstKey][0]
            : apiErrors[firstKey];

          this.showToast(`Registration failed: ${message}`);
        },
      });
    }
  }

  showToast(message: string, duration: number = 3000): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, duration);
  }

  hideToast(): void {
    this.toastVisible = false;
  }
}
