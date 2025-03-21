import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { Post } from '../../_models/post';
import { CommentComponent } from "../comment/comment.component";
import { AccountService } from '../../_services/account.service';
import { LikeService } from '../../_services/like.service';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../_services/comment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  imports: [CommonModule, CommentComponent, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  accountService = inject(AccountService);
  likeService = inject(LikeService);
  commentService = inject(CommentService);

  @Input() post: Post = {} as Post;
  isLiked = signal<boolean>(false);

  newCommentText = '';

  ngOnInit() {
    if (this.post && this.post.likes) {
      this.isLiked.set(this.post.likes.some(like => like.userId === this.accountService.currentUser()?.id));
    }
  }

  convertDateFormat(date?: Date) {
    if (!date) return;
    const newDate = new Date(date);
    const currentYear = new Date().getFullYear();
    const postYear = newDate.getFullYear();

    if (postYear === currentYear) {
      return newDate.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    } else {
      return newDate.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  loadNextPageOfComments() {
    const pageSize = 5;
    const pageNumber = (this.post.comments?.length ?? pageSize / pageSize) + 1;
    this.commentService.getCommentsOfPost(this.post.id, pageSize, pageNumber).subscribe({
      next: response => {
        this.post.comments = [...this.post.comments ?? [], ...response];
      },
      error: e => console.error(e)
    });
  }

  createComment() {
    this.commentService.createComment(this.post.id, this.newCommentText).subscribe({
      next: response => {
        this.post.comments?.unshift(response);
        this.post.commentCount++;
        this.newCommentText = '';
      },
      error: e => console.error(e)
    });
  }

  likePost() {
    this.likeService.likePost(this.post.id).subscribe({
      next: response => {
        this.post.likes.unshift(response);
        this.isLiked.set(true);
      },
      error: e => console.log(e)
    });
  }

  unlikePost() {
    this.likeService.unlikePost(this.post.id).subscribe({
      next: () => {
        this.post.likes = this.post.likes.filter(l => l.userId !== this.accountService.currentUser()?.id);
        this.isLiked.set(false);
      },
      error: e => console.log(e)
    });
  }

  toggleLike() {
    if (this.isLiked()) {
      this.likeService.unlikePost(this.post.id).subscribe({
        next: () => {
          this.post.likes = this.post.likes.filter(l => l.userId !== this.accountService.currentUser()?.id);
          this.isLiked.set(false);
        },
        error: e => console.error(e)
      });
    } else {
      this.likeService.likePost(this.post.id).subscribe({
        next: response => {
          this.post.likes.unshift(response);
          this.isLiked.set(true);
        },
        error: e => console.error(e)
      });
    }
  }

  toggleComments() {
    if (this.post.comments) {
      this.post.comments = undefined;
    } else {
      this.commentService.getCommentsOfPost(this.post.id).subscribe({
        next: response => {
          this.post.comments = [];
          this.post.comments = [...this.post.comments, ...response]
        },
        error: e => console.error(e)
      });
    }
  }
}