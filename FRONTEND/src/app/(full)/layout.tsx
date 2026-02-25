import Header from "@/layouts/header"
import UserHydrator from '@/app/(full)/UserHydrator'
import Footer from "@/layouts/footer"

export async function generateMetadata() {
  return {
    title: 'Trang chủ',
    description: 'Mô tả trang chủ',
   
  };
}
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
        <div className="container mx-auto max-w-360 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
