import { USER_STATUS } from "@/const/status";

export type UserType = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: {
    id: number;
    name: string;
  };
  createdAt: string;
  status: USER_STATUS;
}

export type UserInfoType = Omit<UserType, 'createdAt' | 'status'>
