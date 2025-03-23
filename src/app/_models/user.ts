import { Photo } from "./photo";

export interface Account {
  id: number;
  userName: string;
  email: string;
  dateOfBirth: Date;
  token?: string;
  firstname: string;
  lastname: string;
  photos: Photo[];
  mainPhoto?: Photo;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth?: Date;
  photos: Photo[];
  mainPhoto?: Photo;
}