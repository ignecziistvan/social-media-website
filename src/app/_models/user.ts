export interface Account {
  id: number;
  userName: string;
  email: string;
  token?: string;
  firstname: string;
  lastname: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  firstname: string;
  lastname: string;
}