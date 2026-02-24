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
    <main>
      <UserHydrator />
      <Header />
      <div>
        {children}
      </div>
    </main>
  );
}
