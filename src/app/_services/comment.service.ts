import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Comment } from '../_models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getCommentsOfPost(postId: number, pageSize?: number, pageNumber?: number) {
    const params = new URLSearchParams();

    pageSize !== undefined ? params.append('pageSize', pageSize?.toString()) : null;
    pageNumber !== undefined ? params.append('pageNumber', pageNumber.toString()) : null;

    return this.http.get<Comment[]>(this.baseUrl + 'comment/post/' + postId + '?' + params);
  }

  createComment(postId: number, text: string) {
    return this.http.post<Comment>(this.baseUrl + 'comment/post/' + postId, {text});
  }
}
