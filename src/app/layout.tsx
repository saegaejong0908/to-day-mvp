import type { Metadata } from "next";

import BottomTabBar from "@/components/nav/BottomTabBar";
import { SessionProvider } from "@/components/providers/SessionProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "to day MVP",
  description: "to day MVP base skeleton",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <main className="pb-20">{children}</main>
          <BottomTabBar />
        </SessionProvider>
      </body>
    </html>
  );
}
