import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from 'react-hot-toast'

import type { Metadata } from "next";

import DialogLoginProvider from "@/provider/dialogLoginProvider"
import ReactQueryProvider from "@/provider/reactProvider"
import { RouterProvider } from "@/provider/routerProvider"
import '@/styles/index.css'

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
  icons: {
    icon: "/favicon/favicon.ico", // default
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png", // optional
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <RouterProvider />
        <ReactQueryProvider>
          <DialogLoginProvider>
            {children}
          </DialogLoginProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
