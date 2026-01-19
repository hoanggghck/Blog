import Header from "@/components/layout/header"
import UserHydrator from './UserHydrator'
import Footer from "@/components/layout/footer"

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
        <div className="container mx-auto max-w-[1440px] px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
