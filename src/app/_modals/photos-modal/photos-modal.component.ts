import { Component, input } from '@angular/core';
import { Photo } from '../../_models/photo';

@Component({
  selector: 'app-photos-modal',
  imports: [],
  templateUrl: './photos-modal.component.html',
  styleUrl: './photos-modal.component.css'
})
export class PhotosModalComponent {
  photos = input.required<Photo[]>();
}
