import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "../../styles/index.css";
import ReactQueryProvider from "@/provider/reactProvider";
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <ReactQueryProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <div className="flex min-h-screen flex-col">
                    <main className="flex-1">{children}</main>
                </div>
            </GoogleOAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
