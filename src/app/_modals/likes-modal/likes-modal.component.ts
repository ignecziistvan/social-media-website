import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { Like } from '../../_models/like';

@Component({
  selector: 'app-likes-modal',
  imports: [],
  templateUrl: './likes-modal.component.html',
  styleUrl: './likes-modal.component.css'
})
export class LikesModalComponent {
  likes = input.required<Like[]>();
  defaultAvatar = 'user.png';
}