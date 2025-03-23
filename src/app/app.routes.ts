import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ProfileComponent } from './_user/profile/profile.component';
import { EditProfileComponent } from './_user/edit-profile/edit-profile.component';
import { LogoutComponent } from './account/logout/logout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'account/edit', component: EditProfileComponent },
  { path: 'profile/:username', component: ProfileComponent }
];
