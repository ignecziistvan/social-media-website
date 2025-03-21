import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../_services/posts.service';
import { CommonModule } from '@angular/common';
import { Post } from '../_models/post';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { PostComponent } from "../_cards/post/post.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  postsService = inject(PostsService);
  accountService = inject(AccountService);
  latestPosts: Post[] = [];

  newPostText = '';

  private pageSize = 5;
  private pageNumber = 0;


  ngOnInit() {
    this.loadNextPage();
  }

  loadNextPage() {
    this.pageNumber++;
    this.postsService.getLatestPosts(this.pageSize, this.pageNumber).subscribe({
      next: response => this.latestPosts = [...this.latestPosts, ...response],
      error: e => console.error(e)
    })
  }

  createPost() {
    if (!this.accountService.currentUser()) return;
    if (!this.newPostText.trim()) return;

    this.postsService.createPost(this.newPostText).subscribe({
      next: response => {
        this.latestPosts.unshift(response);
        this.newPostText = '';
      },
      error: e => console.log(e)
    });
  }
}