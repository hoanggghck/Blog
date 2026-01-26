"use client";
import { useGetUser } from "@/hooks/auth/useAuth";
import { useAuthenStore } from "@/stores/useAuthenStore";
import { useEffect } from "react"

const UserHydrator = () => {
  const { setUser } = useAuthenStore();
  const { data, isSuccess } = useGetUser();
  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [data, setUser]);

  return null;
}

export default UserHydrator;
