import { USER_STATUS } from "@/const/status";

export enum ROLES {
  ADMIN = 1,
  BLOGGER = 2
}
export interface UserType {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: {
    id: ROLES;
    name: string;
  };
  roleName: string;
  createdAt: string;
  status: USER_STATUS;
}

export interface UserInfoType extends Omit<UserType, 'createdAt' | 'status'> {}
