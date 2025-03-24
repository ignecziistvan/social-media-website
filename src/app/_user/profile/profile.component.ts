import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/user';
import { Post } from '../../_models/post';
import { PostComponent } from "../../_cards/post/post.component";
import { PostsService } from '../../_services/posts.service';
import { AccountService } from '../../_services/account.service';
import { PhotosModalComponent } from "../../_modals/photos-modal/photos-modal.component";

@Component({
  selector: 'app-profile',
  imports: [PostComponent, RouterLink, PhotosModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  private userService = inject(UserService);
  private postsService = inject(PostsService);

  defaultAvatar = 'user.png';

  user: User|null = null;
  posts: Post[] = [];

  private pageSize = 5;
  private pageNumber = 0;

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile() {
    this.route.paramMap.subscribe(params => {
      if (!params) this.router.navigateByUrl('/');
      this.userService.getUser(params.get('username') ?? '').subscribe({
        next: response => {
          this.user = response;
          this.loadNextPageOfPosts();
        },
        error: e => {
          console.error(e);
          this.router.navigateByUrl('');
        }
      });
    });
  }

  triggerPhotosModal() {
    const modal = document.querySelector('dialog') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  loadNextPageOfPosts() {
    this.postsService.getPostsOfUser(this.user!.userName, this.pageSize, this.pageNumber + 1).subscribe({
      next: response => {
        this.posts = [...this.posts, ...response];
        this.pageNumber++;
      },
      error: e => console.error(e)
    })
  }
}