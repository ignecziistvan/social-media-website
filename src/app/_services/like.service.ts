import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Like } from '../_models/like';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  likePost(postId: number) {
    return this.http.post<Like>(this.baseUrl + 'like/post/' + postId, {});
  }

  unlikePost(postId: number) {
    return this.http.delete(this.baseUrl + 'like/post/' + postId);
  }

  getLikesOfPost(postId: number) {
    return this.http.get(this.baseUrl + 'like/post/' + postId);
  }

  getLikesOfUser(username: string) {
    return this.http.get(this.baseUrl + 'like/user/' + username);
  }
}