
'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { setRouter } from "@/utils/navigation";

export default function RouterProvider() {
  const router = useRouter();

  useEffect(() => {
    setRouter((path: string) => router.push(path));
  }, [router]);

  return null;
}