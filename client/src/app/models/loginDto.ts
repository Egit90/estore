import { Basket } from "./basket";

export interface LoginDto {
  email: string;
  userName: string;
  token: string;
  basket?: Basket;
}

export interface RegisterDto {
  userName: string;
  password: string;
  email: string;
}
