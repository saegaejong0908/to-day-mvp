"use client";

import type { ReactNode } from "react";

import HUDBar from "@/components/layout/HUDBar";
import type { CoreCoach, GoalType } from "@/types/coach";

type AppShellProps = {
  tab: "goal" | "todo";
  activeGoal?: {
    title: string;
    goalType: GoalType;
  } | null;
  userCoreCoach?: CoreCoach | null;
  children: ReactNode;
};

export default function AppShell({ tab, activeGoal, userCoreCoach, children }: AppShellProps) {
  return (
    <main className="app-shell">
      <div className="app-shell-bg" aria-hidden />
      <div className="app-shell-content">
        <HUDBar tab={tab} activeGoal={activeGoal} userCoreCoach={userCoreCoach} />
        <div className="space-y-5 pb-24">{children}</div>
      </div>
    </main>
  );
}

