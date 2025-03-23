import { Component, Input, input } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { Comment } from '../../_models/comment';

@Component({
  selector: 'app-comment',
  imports: [TimeagoModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment: Comment = {} as Comment;
  defaultAvatar = 'user.png';

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
}
