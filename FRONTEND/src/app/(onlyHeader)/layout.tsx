import type { Metadata } from "next"

import Header from "@/components/layout/header"
import UserHydrator from "../(full)/UserHydrator"

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog Tech",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserHydrator />
      <Header />
      <main className="flex-1 min-h-full">
        {children}
      </main>
    </>
  );
}
