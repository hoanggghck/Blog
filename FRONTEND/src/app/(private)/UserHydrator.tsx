"use client";
import { useUserStore } from "@/stores/useUserStore";
import { UserType } from "@/types";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const UserHydrator = ({ user }: { user: UserType}) => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user.id) {
      setUser(user)
    }
  }, [user, setUser]);

  return null;
}

export default UserHydrator;
