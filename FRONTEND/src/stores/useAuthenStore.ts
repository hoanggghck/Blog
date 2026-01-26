import { create } from "zustand";
import { ROLES, UserInfoType } from "@/types/user";

type AuthType = {
  isAuthorize: boolean;
  user: UserInfoType;
  setUser: (user: UserInfoType) => void;
  clearUser: () => void;
};
const initialUser: UserInfoType = {
  id: 0,
  name: "",
  email: "",
  avatarUrl: "",
  role: {
    id: ROLES.BLOGGER,
    name: ''
  }
}

export const useAuthenStore = create<AuthType>((set) => ({
  isAuthorize: false,
  user: initialUser,
  setUser: (user) => {
    set({ user });
    set({ isAuthorize: true });
  },
  clearUser: () => {
    set({ user: initialUser });
    set({ isAuthorize: false });
  },
}));