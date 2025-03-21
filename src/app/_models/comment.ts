export interface Comment {
  id: number;
  userId: number;
  userName: string;
  postId: number;
  text: string;
  created: Date
}