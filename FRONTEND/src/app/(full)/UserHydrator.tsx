"use client";
import { useGetUser } from "@/hooks/auth/useAuth";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react"

const UserHydrator = () => {
  // const { setUser } = useUserStore();
  // const { data } = useGetUser();
  // useEffect(() => {
  //   if (data) {
  //     setUser(data)
  //   }
  // }, [data, setUser]);

  return null;
}

export default UserHydrator;
