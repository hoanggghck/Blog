// stores/useUserStore.ts
import { create } from "zustand";
import { UserInfoType } from "@/types/user";

type UserStore = {
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
      id: 0,
      name: ''
    }
  }

export const useUserStore = create<UserStore>((set) => ({
  user: initialUser,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: initialUser }),
}));