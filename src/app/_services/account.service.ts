import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../_models/user';

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
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  register(model:any) {
    return this.http.post<Account>(this.baseUrl + 'auth/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: Account) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }
}