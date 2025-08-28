import type { Metadata } from "next";

import Header from "@/components/layout/header";
import Footer from "@/components/footer";
import { getUserInfo } from "@/hooks/user/useGetUserInfo";

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog Tech",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getUserInfo();
  return (
    <>
      <Header />
      <main className="flex-1 min-h-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
