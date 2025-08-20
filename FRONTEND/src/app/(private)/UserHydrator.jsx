"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";

const UserHydrator = ({ user }) => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return null; // doesn't render anything
}

export default UserHydrator; 