"use client"
import { useUsers } from "@/hooks/user/useGetUser";
import Image from "next/image";

export default function Home() {
  const { data, isLoading, isError, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {data?.items.map((user) => (
        <li key={user.id}>
          {user.name} ({user.email})
        </li>
      ))}
    </div>
  );
}
