import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllUsers() {
    return this.http.get<User[]>(this.baseUrl + 'user');
  }

  getUser(userName: string) {
    return this.http.get<User>(this.baseUrl + 'user/' + userName);
  }
}
