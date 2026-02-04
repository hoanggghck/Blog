import Header from "@/layouts/header"
import UserHydrator from '@/app/(full)/UserHydrator'
import Footer from "@/layouts/footer"

export async function generateMetadata() {
  return {
    title: 'Trang chủ blogs',
    description: 'Mô tả trang chủ Blogs',
   
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
        <div className="container mx-auto max-w-[1440px] px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
