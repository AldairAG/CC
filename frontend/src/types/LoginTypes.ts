import type { UserType } from "./UserTypes";

export type LoginRequest= {
  email: string;
  password: string;
}

export type LoginResponse ={
  token?: string|null;
  usuario: UserType;
  error?: string;
}