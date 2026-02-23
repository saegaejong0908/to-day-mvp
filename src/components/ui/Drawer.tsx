"use client";

import type { ReactNode } from "react";

type DrawerProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function Drawer({ title, isOpen, onToggle, children }: DrawerProps) {
  return (
    <section className="ui-panel">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between text-left">
        <span className="text-sm font-extrabold text-gray-900">{title}</span>
        <span className="ui-chip">{isOpen ? "접기" : "열기"}</span>
      </button>
      {isOpen ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}

