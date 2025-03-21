import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Post } from '../_models/post';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getLatestPosts(pageSize: number, pageNumber: number) {
    const params = new URLSearchParams();

    params.append('pageSize', pageSize.toString());
    params.append('pageNumber', pageNumber.toString());

    return this.http.get<Post[]>(this.baseUrl + 'post?' + params);
  }

  getPostsOfUser(userName: string, pageSize: number, pageNumber: number) {
    const params = new URLSearchParams();

    params.append('pageSize', pageSize?.toString());
    params.append('pageNumber', pageNumber.toString());

    return this.http.get<Post[]>(this.baseUrl + 'post/user/' + userName + '?' + params);
  }

  createPost(text: string) {
    return this.http.post<Post>(this.baseUrl + 'post', {text});
  }

  deletePost(postId: number) {
    return this.http.delete(this.baseUrl + 'post/' + postId);
  }

  updatePost(postId: number, text: string) {
    return this.http.put<Post>(this.baseUrl + 'post/' + postId, {text});
  }
}