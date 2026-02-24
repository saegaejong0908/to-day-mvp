import type { Metadata } from "next";

import { SessionProvider } from "@/components/providers/SessionProvider";
import { auth } from "@/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "to day MVP",
  description: "to day MVP base skeleton",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="ko">
      <body>
        <SessionProvider session={session}>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
