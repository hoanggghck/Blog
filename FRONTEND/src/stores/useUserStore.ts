// stores/useUserStore.ts
import { create } from "zustand";
import { UserType } from "@/types/user";

type UserStore = {
  user: UserType;
  setUser: (user: UserType) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: {
    id: 0,
    name: "",
    email: "",
    avatarUrl: ""
  } as UserType,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: {} as UserType }),
}));