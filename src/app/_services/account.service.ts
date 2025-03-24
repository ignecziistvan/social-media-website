import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../_models/user';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  currentUser = signal<Account | null>(null);
  roles = computed(() => {
    const user = this.currentUser();
    if (user && user.token) {
      return JSON.parse(atob(user.token.split('.')[1])).role
    }
    return null;
  })

  constructor () {
    const storedUser = localStorage.getItem('user') ?? '';
    const user : Account | null = storedUser !== '' ? JSON.parse(storedUser) : null;
    if (user !== null) this.currentUser.set(user);
  }

  login(model: any) {
    return this.http.post<Account>(this.baseUrl + 'auth/login', model).pipe(
      map(user => user ? this.setCurrentUser(user) : null)
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  register(model: any) {
    return this.http.post<Account>(this.baseUrl + 'auth/register', model).pipe(
      map(user => user ? this.setCurrentUser(user) : null)
    );
  }

  updateProfile(model: any) {
    return this.http.put<Account>(this.baseUrl + 'user', model).pipe(
      map(user => user ? this.setCurrentUser(user) : null)
    );
  }

  setNewAvatar(form: FormData) {
    return this.http.post<Photo>(this.baseUrl + 'user/upload-photo', form).pipe(
      map(photo => {
        console.log(photo);
        
        this.currentUser()!.mainPhoto = photo;
        this.currentUser()!.photos.unshift(photo);

        console.log(this.currentUser());
        
        localStorage.setItem('user', JSON.stringify(this.currentUser()));
      })
    );
  }

  private setCurrentUser(user: Account) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }
}