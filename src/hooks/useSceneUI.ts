"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export type ScenePanelType = "goal" | "todo";

export function useSceneUI(panelType: ScenePanelType) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const requested = searchParams.get("panel");
    const matchedPath = panelType === "goal" ? pathname === "/goal" : pathname === "/todo";
    if (matchedPath && requested === "open") {
      setIsPanelOpen(true);
    }
  }, [panelType, pathname, searchParams]);

  return {
    isPanelOpen,
    openPanel: () => setIsPanelOpen(true),
    closePanel: () => setIsPanelOpen(false),
    togglePanel: () => setIsPanelOpen((prev) => !prev),
  };
}

