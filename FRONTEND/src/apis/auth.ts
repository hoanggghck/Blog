import type { UserInfoType } from "@/types"
import type { LoginType, LoginResponseType, RegisterType, GoogleLoginType } from "@/types/auth"

import { apiServicePublic } from "@/lib/base-api.public"
import { apiServicePrivate } from "@/lib/base-api.private"

export const authApi = {
  login: async (p: LoginType) => await apiServicePublic.post<LoginType, LoginResponseType>('/login', p),
  loginGoogle: async (p: GoogleLoginType) => await apiServicePublic.post<GoogleLoginType, LoginResponseType>('/google-login', p),
  register: async (p: RegisterType) => await apiServicePublic.post<RegisterType, LoginResponseType>('/register', p),
  logout: async () => await apiServicePrivate.get<any>('/logout'),
  refresh: async () => await apiServicePrivate.get<LoginResponseType>('/refresh'),
  getInfo: async () => await apiServicePrivate.get<UserInfoType>('/info')
}
