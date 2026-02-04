import { ROLES } from "@/const/enum";
import { USER_STATUS } from "@/const/status";

export interface UserType {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: {
    id: ROLES;
    name: string;
  };
  roleName?: string;
  createdAt: string;
  status: USER_STATUS;
}

export interface UserInfoType extends Omit<UserType, 'createdAt' | 'status'> {}
