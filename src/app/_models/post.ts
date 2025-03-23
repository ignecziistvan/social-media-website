import { Comment } from "./comment";
import { Like } from "./like"
import { Photo } from "./photo";

export interface Post {
  id: number;
  userId: number;
  userName: string;
  userMainPhoto?: Photo;
  text: string;
  created: Date;

  commentCount: number;
  likes: Like[];
  photos: Photo[];

  comments?: Comment[];
}