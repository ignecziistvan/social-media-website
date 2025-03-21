import { Comment } from "./comment";
import { Like } from "./like"

export interface Post {
  id: number;
  userId: number;
  userName: string;
  text: string;
  created: Date;

  commentCount: number;

  likes: Like[];
  comments?: Comment[];
}