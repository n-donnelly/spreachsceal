import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  isLoginMode = signal(true);
  errorMessage = signal('');
  isLoading = signal(false);

  authForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.errorMessage.set('');
    this.authForm.reset();
  }

  async onSubmit() {
    if (this.authForm.invalid) return;
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    const { email, password } = this.authForm.getRawValue();

    try {
      if (this.isLoginMode()) {
        await this.auth.signIn(email, password);
      } else {
        await this.auth.signUp(email, password);
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Authentication failed');
    } finally {
      this.isLoading.set(false);
    }
  }
}
