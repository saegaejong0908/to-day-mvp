"use client";

import type { ReactNode } from "react";

import CharacterAvatar from "@/components/CharacterAvatar";
import Drawer from "@/components/ui/Drawer";
import { coreMeta } from "@/lib/charactersMeta";
import type { CoreCoach } from "@/types/coach";

type QuestLayoutProps = {
  goalTitle?: string;
  coreCoach: CoreCoach | null;
  nextPanel: ReactNode;
  coachPanel: ReactNode;
  isGoalsOpen: boolean;
  onToggleGoals: () => void;
  goalsContent: ReactNode;
  isBacklogOpen: boolean;
  onToggleBacklog: () => void;
  backlogContent: ReactNode;
  isTodoListOpen: boolean;
  onToggleTodoList: () => void;
  todoListContent: ReactNode;
};

export default function QuestLayout({
  goalTitle,
  coreCoach,
  nextPanel,
  coachPanel,
  isGoalsOpen,
  onToggleGoals,
  goalsContent,
  isBacklogOpen,
  onToggleBacklog,
  backlogContent,
  isTodoListOpen,
  onToggleTodoList,
  todoListContent,
}: QuestLayoutProps) {
  const core = coreCoach ? coreMeta[coreCoach] : null;

  return (
    <div className="space-y-4">
      <section className="ui-panel border-emerald-200 bg-emerald-50/50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="ui-chip">구조형</span>
          <p className="text-sm font-black text-emerald-900">오늘의 퀘스트: {goalTitle ?? "목표 없음"}</p>
          {core ? (
            <div className="ml-auto flex items-center gap-2">
              <CharacterAvatar imageSrc={core.imageMono} alt={core.nameKo} size="sm" fallbackText={core.short} />
              <span className="text-xs font-bold text-gray-700">{core.nameKo}</span>
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>{nextPanel}</div>
        <div>{coachPanel}</div>
      </div>

      <div className="space-y-3">
        <Drawer title="목표 변경" isOpen={isGoalsOpen} onToggle={onToggleGoals}>
          {goalsContent}
        </Drawer>
        <Drawer title="백로그(나중)" isOpen={isBacklogOpen} onToggle={onToggleBacklog}>
          {backlogContent}
        </Drawer>
        <Drawer title="전체 목록" isOpen={isTodoListOpen} onToggle={onToggleTodoList}>
          {todoListContent}
        </Drawer>
      </div>
    </div>
  );
}

