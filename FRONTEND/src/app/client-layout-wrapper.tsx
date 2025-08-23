"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Những route không cần Header/Footer


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
        <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
