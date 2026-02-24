"use client";

import { useEffect, type ReactNode } from "react";

type ScenePanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function ScenePanel({ open, title, onClose, children }: ScenePanelProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="scene-panel-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="패널 닫기" className="scene-panel-overlay" onClick={onClose} />
      <section className="scene-panel-drawer">
        <div className="scene-panel-header">
          <h2 className="text-sm font-black uppercase tracking-[0.12em] text-gray-700">{title}</h2>
          <button type="button" className="ui-btn-secondary" onClick={onClose}>
            x
          </button>
        </div>
        <div className="scene-panel-content">{children}</div>
      </section>
    </div>
  );
}

