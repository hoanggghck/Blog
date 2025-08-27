"use client";
import { useUserStore } from "@/stores/useUserStore";
import { UserType } from "@/types";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const UserHydrator = ({ user }: { user: UserType | null}) => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user && user.id) {
      setUser(user)
    }
  }, [user, setUser]);

  return null;
}

export default UserHydrator;
