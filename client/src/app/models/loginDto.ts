import { Basket } from "./basket";

export interface UserInfo {
  email: string;
  userName: string;
  token: string;
}

export interface LoginDto {
  userInfo: UserInfo;
  basket?: Basket;
}

export interface RegisterDto {
  userName: string;
  password: string;
  email: string;
}
