import { GoogleOAuthProvider } from "@react-oauth/google";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const content = (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );

  return googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  ) : content;
}