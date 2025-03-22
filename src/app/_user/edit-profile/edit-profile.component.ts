import { Component, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TextInputComponent } from "../../_forms/text-input/text-input.component";
import { DateInputComponent } from '../../_forms/date-input/date-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, TextInputComponent, DateInputComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  user = this.accountService.currentUser()!;

  error: string | undefined;
  success: string | undefined;
  maxDate = new Date();

  editForm = this.fb.group({
    userName: [this.user.userName],
    email: [this.user.email, Validators.email],
    dateOfBirth: [this.user.dateOfBirth],
    firstname: [this.user.firstname],
    lastname: [this.user.lastname],
    password: ['', [Validators.minLength(6), Validators.maxLength(32)]],
    confirmPassword: ['', [this.matchValues('password')]],
    oldPassword: ['', [Validators.minLength(6), Validators.maxLength(32)]]
  });

  submitForm() {
    if (this.editForm.invalid) return;

    const formData = this.editForm.value;
    if (formData.password !== formData.confirmPassword) return;

    this.accountService.updateProfile(this.prepareFormForSubmit(formData)).subscribe({
      next: () => {
        this.success = 'Profile updated successfully';
        this.error = undefined;
      },
      error: e => {
        this.success = undefined;
        this.error = typeof(e.error) === 'string' ? e.error : 'Failed to update profile';
      }
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const parent = control.parent;
      if (!parent) return null;
  
      const password = parent.get(matchTo)?.value;
      const confirmPassword = control.value;
  
      if (!password || !confirmPassword) {
        return null;
      }
      
      return password === confirmPassword ? null : { isMatching: true };
    };
  }
  

  private prepareFormForSubmit(editForm: Partial<{
    userName: string | null;
    email: string | null;
    dateOfBirth: Date | null;
    firstname: string | null;
    lastname: string | null;
    password: string | null;
    confirmPassword: string | null;
    oldPassword: string | null;
  }>) {
    const formData: any = {};
  
    const keys: Array<keyof typeof editForm> = [
      'userName', 'email', 'dateOfBirth', 'firstname', 'lastname', 'password', 'confirmPassword', 'oldPassword'
    ];
  
    keys.forEach(key => {
      const value = editForm[key];

      if (key === 'userName' && value === this.accountService.currentUser()?.userName) return;
      if (key === 'email' && value === this.accountService.currentUser()?.email) return;

      if (value !== null && value !== undefined && value !== '') {
        formData[key] = value;
      }
    });
  
    return formData;
  }
}