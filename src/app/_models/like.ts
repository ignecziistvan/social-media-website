import { Photo } from "./photo"

export interface Like {
  id: number,
  userId: number,
  postId: number,
  userName: string
  userMainPhoto?: Photo;
}