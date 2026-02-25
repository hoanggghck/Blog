import type { Metadata } from "next"

import Header from "@/layouts/header"
import UserHydrator from "@/app/(full)/UserHydrator"

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
    <main className="h-screen flex flex-col">
      <UserHydrator />
      <Header />
      <div className="flex-1 min-h-0 flex flex-col">
        {children}
      </div>
    </main>
  );
}
