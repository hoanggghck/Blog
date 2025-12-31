import Header from "@/layout/header"
import UserHydrator from './UserHydrator'
import Footer from "@/layout/footer"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
   return (
    <>
      <UserHydrator/>
      <Header />
      <main className="flex-1 min-h-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
