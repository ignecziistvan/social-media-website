import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  error: string | undefined;
  maxDate = new Date();

  registerForm = this.fb.group({
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', [
      Validators.required, Validators.minLength(6), Validators.maxLength(32)
    ]],
    confirmPassword: ['', [Validators.required, this.matchValues('password')]],
  });

  ngOnInit() {
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const patchedForm = this.registerForm.value;
      patchedForm.dateOfBirth = this.convertDateFormat(this.registerForm.get('dateOfBirth')?.value);

      this.accountService.register(patchedForm).subscribe({
        next: _ => this.router.navigateByUrl('/'),
        error: e => this.error = typeof(e.error) === 'string' ? e.error : 'Failed to register'   
      });
    }
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { isMatching: true }
    };
  }

  private convertDateFormat(dob: string | null | undefined) {
    if (!dob) return;
    const date = new Date(dob);
    return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();
  }
}
