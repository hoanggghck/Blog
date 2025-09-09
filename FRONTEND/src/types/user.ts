import { USER_STATUS } from "@/const/status";

export type UserType = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  roleName: string;
  createdAt: string;
  status: USER_STATUS;
}
