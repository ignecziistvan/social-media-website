import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  error: string | undefined;

  loginForm = this.fb.group({
    userNameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.error = undefined;
      this.accountService.login(this.loginForm.value).subscribe({
        next: _ => this.router.navigateByUrl('/'),
        error: _ => this.error = 'Bad credentials'
      });
    }
  }
}
