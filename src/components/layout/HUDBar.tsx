"use client";

import CharacterAvatar from "@/components/CharacterAvatar";
import { coreMeta } from "@/lib/charactersMeta";
import type { CoreCoach, GoalType } from "@/types/coach";

type HUDBarProps = {
  tab: "goal" | "todo";
  activeGoal?: {
    title: string;
    goalType: GoalType;
  } | null;
  userCoreCoach?: CoreCoach | null;
};

export default function HUDBar({ tab, activeGoal, userCoreCoach }: HUDBarProps) {
  const tabLabel = tab === "goal" ? "목표" : "투두";
  const goalTypeLabel =
    activeGoal?.goalType === "structured" ? "구조형" : activeGoal?.goalType === "exploratory" ? "탐색형" : null;
  const core = userCoreCoach ? coreMeta[userCoreCoach] : null;

  return (
    <header className="hud-bar">
      <div className="hud-col">
        <p className="hud-caption">Tab</p>
        <p className="hud-value">{tabLabel}</p>
      </div>

      <div className="hud-col hud-col-center">
        <p className="hud-caption">Active Goal</p>
        <div className="flex items-center gap-2">
          <p className="hud-value truncate">{activeGoal?.title ?? "목표를 선택해 주세요"}</p>
          {goalTypeLabel ? <span className="ui-chip">{goalTypeLabel}</span> : null}
        </div>
      </div>

      <div className="hud-col hud-col-right">
        <p className="hud-caption">Core Coach</p>
        {core ? (
          <div className="flex items-center gap-2">
            <CharacterAvatar imageSrc={core.imageMono} alt={core.nameKo} size="sm" fallbackText={core.short} />
            <span className="hud-value">{core.nameKo}</span>
          </div>
        ) : (
          <span className="text-xs font-semibold text-gray-500">미설정</span>
        )}
      </div>
    </header>
  );
}

