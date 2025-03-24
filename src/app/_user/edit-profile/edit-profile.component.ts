import { Component, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TextInputComponent } from "../../_forms/text-input/text-input.component";
import { DateInputComponent } from '../../_forms/date-input/date-input.component';
import { PhotosModalComponent } from '../../_modals/photos-modal/photos-modal.component';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, TextInputComponent, DateInputComponent, PhotosModalComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  user = this.accountService.currentUser()!;
  defaultAvatar = 'user.png';

  avatarSuccess: string | undefined;
  avatarError: string | undefined;
  error: string | undefined;
  success: string | undefined;
  maxDate = new Date();

  selectedNewAvatar?: { file: File, previewUrl: string } = undefined;
  isSubmitting: boolean = false;

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

  triggerPhotosModal() {
    if (this.selectedNewAvatar || this.isSubmitting) return;
    const modal = document.querySelector('dialog') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  submitForm() {
    const formData = this.editForm.value;
    if (formData.password !== formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.editForm.invalid) return;

    this.isSubmitting = true;

    this.accountService.updateProfile(this.prepareFormForSubmit(formData)).subscribe({
      next: () => {
        this.success = 'Profile updated successfully';
        this.error = undefined;
        this.isSubmitting = false;
        this.user = this.accountService.currentUser()!;
      },
      error: e => {
        this.success = undefined;
        this.error = typeof(e.error) === 'string' ? e.error : 'Failed to update profile';
        this.isSubmitting = false;
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
  
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    for (const file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedNewAvatar = { file, previewUrl: reader.result as string };
      };
    }
  }

  changeAvatar() {
    if (!this.selectedNewAvatar?.file) return;

    this.isSubmitting = true;

    const form = new FormData();
    form.append('file', this.selectedNewAvatar.file);

    this.accountService.setNewAvatar(form).subscribe({
      next: () => {
        this.selectedNewAvatar = undefined;
        this.isSubmitting = false;
        this.avatarSuccess = 'Avatar has been changed';
      },
      error: e => {
        this.selectedNewAvatar = undefined;
        this.isSubmitting = false;
        this.avatarError = 'Failed to change avatar';
      }
    });
  }

  cancelNewAvatar() {
    this.selectedNewAvatar = undefined;
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