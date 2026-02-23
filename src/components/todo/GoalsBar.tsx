"use client";

import CharacterAvatar from "@/components/CharacterAvatar";
import { methodMeta } from "@/lib/charactersMeta";
import type { Goal } from "@/types/coach";

type GoalsBarProps = {
  goals: Goal[];
  activeGoalId: string | null;
  onSelectGoal: (goalId: string) => void;
  onClickAdd: () => void;
};

export default function GoalsBar({
  goals,
  activeGoalId,
  onSelectGoal,
  onClickAdd,
}: GoalsBarProps) {
  return (
    <section className="ui-panel space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">Goals</h2>
        <button type="button" onClick={onClickAdd} className="ui-btn-secondary">
          + 목표 추가
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {goals.map((goal) => {
          const isActive = goal.id === activeGoalId;
          const method = methodMeta[goal.goalType === "structured" ? "robot" : goal.methodMode];
          const goalTypeLabel = goal.goalType === "structured" ? "구조형" : "탐색형";
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelectGoal(goal.id)}
              className={[
                "min-w-max rounded-xl border px-3 py-2 text-left transition",
                isActive ? "border-amber-300 bg-amber-50/80 text-gray-800" : "border-amber-200 bg-white text-gray-700",
              ].join(" ")}
            >
              <div className="text-sm font-semibold">{goal.title}</div>
              <div className="mt-1">
                <span className="ui-chip">{goalTypeLabel}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <CharacterAvatar
                  imageSrc={method.imageMono}
                  alt={method.nameKo}
                  size="sm"
                  fallbackText={method.short}
                  className={isActive ? "border-amber-300" : ""}
                />
                <span className="text-[10px] font-bold text-gray-500">
                  {method.nameKo}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
