import { Photo } from "./photo";

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userMainPhoto?: Photo;
  postId: number;
  text: string;
  created: Date
}