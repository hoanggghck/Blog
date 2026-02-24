import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from 'react-hot-toast'
import NextTopLoader from "nextjs-toploader";

import type { Metadata } from "next";

import DialogLoginProvider from "@/provider/dialog-login-provider"
import ReactQueryProvider from "@/provider/react-provider"
import RouterProvider from "@/provider/router-provider"
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
        <NextTopLoader
          color="#a855f7"
          height={3}
          showSpinner={false}
        />
        <ReactQueryProvider>
          <DialogLoginProvider>
            {children}
          </DialogLoginProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
