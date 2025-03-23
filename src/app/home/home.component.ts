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

  isSubmitting: boolean = false;
  newPostText = '';
  selectedFiles: { file: File, previewUrl: string }[] = [];
  newPostError: string|undefined = undefined;

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

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    if (files.length + this.selectedFiles.length > 10) {
      this.newPostError = 'You cannot add more than 10 photos';
      return;
    }

    for (const file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedFiles.push({ file, previewUrl: reader.result as string });
      };
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  createPost() {
    this.newPostError = undefined;
    if (!this.accountService.currentUser()) return;
    if (!this.newPostText.trim()) {
      this.newPostError = 'You must provide a text';
      return;
    }

    this.isSubmitting = true;

    const photos = this.selectedFiles.map(x => x.file);

    const form = new FormData();
    form.append('text', this.newPostText);
    photos.forEach(file => {
      form.append('files', file);
    });

    this.postsService.createPost(form).subscribe({
      next: response => {
        this.latestPosts.unshift(response);
        this.newPostText = '';
        this.selectedFiles = [];
        this.newPostError = undefined;
        this.isSubmitting = false;
      },
      error: e => {
        this.newPostError = typeof(e.error) === 'string' ? e.error : 'Failed to add Post';
        this.isSubmitting = false;
      }
    });
  }
}