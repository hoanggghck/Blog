export type LoginType = {
  username: string;
  password: string;
}

export type RegisterType = {
    username: string;
    email: string
    password: string;
}

export type LoginResponseType = {
  accessToken: string;
  refreshToken: string;
}
