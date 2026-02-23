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
    <section className="space-y-3 rounded-2xl border border-amber-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">Goals</h2>
        <button
          type="button"
          onClick={onClickAdd}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
        >
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
                isActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
              ].join(" ")}
            >
              <div className="text-sm font-semibold">{goal.title}</div>
              <div className="mt-1">
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {goalTypeLabel}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <CharacterAvatar
                  imageSrc={method.imageMono}
                  alt={method.nameKo}
                  size="sm"
                  fallbackText={method.short}
                  className={isActive ? "border-gray-600" : ""}
                />
                <span className={isActive ? "text-[10px] font-bold text-gray-200" : "text-[10px] font-bold text-gray-500"}>
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
