"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const accessToken = localStorage.getItem("accessToken");
    // const refreshToken = localStorage.getItem("refreshToken");

    // if (!accessToken || !refreshToken) {
    //   router.replace("/login");
    // } else {
    //   setLoading(false);
    // }
  }, [router]);

  return { loading };
}