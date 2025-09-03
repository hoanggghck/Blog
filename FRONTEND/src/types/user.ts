export type UserType = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

export type AuthResponseType = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  roleId: number | null;
  createdAt: string;
  updatedAt: string;
}
