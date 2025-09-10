"use client";
import { authApi, userApi } from "@/apis";
import { useUserStore } from "@/stores/useUserStore";
import { UserType } from "@/types";
import { useEffect } from "react";

const UserHydrator = ({ user }: { user: UserType | null}) => {
  const setUser = useUserStore((state) => state.setUser);
  const fetchUserInfo = async () => {
    const res = await authApi.getInfo();
      if (!res) return null;
      if (res.data) {
        setUser(res.data.result);
      }
  }
  useEffect(() => {
    if (user && user.id) {
      setUser(user)
    } else {
      fetchUserInfo()
    }
  }, [user]);

  return null;
}

export default UserHydrator;
