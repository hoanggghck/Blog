export interface LoginType {
  username: string;
  password: string;
}

export interface GoogleLoginType {
  accessToken: string;
}

export interface RegisterType {
  username: string;
  email: string
  password: string;
}

export interface LoginResponseType {
  accessToken: string;
  refreshToken: string;
}
