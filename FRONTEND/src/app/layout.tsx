import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import type { Metadata } from "next";
import '../styles/index.css';

import ReactQueryProvider from "@/provider/reactProvider";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog Tech",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  const refreshToken = cookieStore.get('refreshToken')?.value ?? '';
  return (
    <html lang="en">
      <head>
        <meta name="x-access-token" content={accessToken} />
        <meta name="x-refresh-token" content={refreshToken} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
