"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/goal?panel=open", activePath: "/goal", label: "목표" },
  { href: "/todo?panel=open", activePath: "/todo", label: "투두" },
] as const;

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto grid h-16 w-full max-w-5xl grid-cols-2 gap-2 px-4 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.activePath;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                "flex items-center justify-center rounded-xl text-sm font-bold transition",
                active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
