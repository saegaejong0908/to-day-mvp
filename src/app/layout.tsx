import type { Metadata } from "next";

import BottomTabBar from "@/components/nav/BottomTabBar";
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
          <main className="pb-20">{children}</main>
          <BottomTabBar />
        </SessionProvider>
      </body>
    </html>
  );
}
