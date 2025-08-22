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
  const noLayout = ["/login"];

  const hideLayout = noLayout.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col">
        {!hideLayout && <Header />}
        <main className="flex-1">{children}</main>
        {!hideLayout && <Footer />}
    </div>
  );
}
