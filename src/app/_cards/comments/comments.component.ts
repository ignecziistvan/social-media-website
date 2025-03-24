import { Component, Input } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { Comment } from '../../_models/comment';

@Component({
  selector: 'app-comments',
  imports: [TimeagoModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() comments: Comment[] = [];
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
