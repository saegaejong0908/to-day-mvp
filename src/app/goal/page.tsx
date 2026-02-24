"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import CharacterAvatar from "@/components/CharacterAvatar";
import CoreCoachModal from "@/components/coach/CoreCoachModal";
import AppShell from "@/components/layout/AppShell";
import ScenePanel from "@/components/scene/ScenePanel";
import GoalCreateModal from "@/components/todo/GoalCreateModal";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/Panel";
import { useGoals } from "@/hooks/useGoals";
import { useSceneUI } from "@/hooks/useSceneUI";
import { useTodos } from "@/hooks/useTodos";
import { useUserCoreCoach } from "@/hooks/useUserCoreCoach";
import { coreMeta, methodMeta } from "@/lib/charactersMeta";

export default function GoalPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? session?.user?.email ?? undefined;
  const { goals, activeGoalId, setActiveGoalId, addGoal, updateGoalMethod, initialized: goalsReady } = useGoals(userId);
  const { coreCoach, setCoreCoach, initialized: coreReady } = useUserCoreCoach(userId);
  const { todos, initialized: todosReady } = useTodos(null, userId);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCoreModalOpen, setIsCoreModalOpen] = useState(false);
  const { isPanelOpen, openPanel, closePanel } = useSceneUI("goal");

  const isReady = goalsReady && coreReady && todosReady;

  useEffect(() => {
    if (isReady && !coreCoach) {
      setIsCoreModalOpen(true);
    }
  }, [isReady, coreCoach]);

  const core = useMemo(() => (coreCoach ? coreMeta[coreCoach] : null), [coreCoach]);
  const nextTodoByGoal = useMemo(() => {
    const entries = new Map<string, string>();
    const grouped = new Map<string, typeof todos>();

    for (const todo of todos) {
      if (todo.isDone || todo.paused === true) {
        continue;
      }
      const list = grouped.get(todo.goalId) ?? [];
      list.push(todo);
      grouped.set(todo.goalId, list);
    }

    for (const [goalId, goalTodos] of grouped.entries()) {
      const nextTodo = goalTodos.sort((a, b) => a.createdAt - b.createdAt)[0];
      if (nextTodo) {
        entries.set(goalId, nextTodo.title);
      }
    }

    for (const goal of goals) {
      if (!goal.nextTodoId) {
        continue;
      }
      const fixedNext = todos.find(
        (todo) =>
          todo.id === goal.nextTodoId &&
          todo.goalId === goal.id &&
          !todo.isDone &&
          todo.paused !== true,
      );
      if (fixedNext) {
        entries.set(goal.id, fixedNext.title);
      }
    }

    return entries;
  }, [goals, todos]);

  if (status === "loading") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-4 px-6 py-8">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </main>
    );
  }
  if (!userId) {
    router.replace("/login");
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-4 px-6 py-8">
        <p className="text-sm text-gray-500">로그인 페이지로 이동 중...</p>
      </main>
    );
  }

  return (
    <AppShell
      tab="goal"
      activeGoal={goals.find((goal) => goal.id === activeGoalId) ?? null}
      userCoreCoach={coreCoach}
    >
      <div className="pointer-events-none min-h-[50vh]">
        <div className="pointer-events-auto flex justify-end">
          <button type="button" onClick={openPanel} className="ui-btn-chip">
            목표 패널 열기
          </button>
        </div>
      </div>

      <ScenePanel open={isPanelOpen} onClose={closePanel} title="Goal Panel">
        <div className="space-y-4">
          <Panel>
            <PanelHeader>
              <h2 className="text-lg font-extrabold text-gray-900">내 코어 캐릭터</h2>
              <button type="button" onClick={() => setIsCoreModalOpen(true)} className="ui-btn-secondary">
                변경
              </button>
            </PanelHeader>
            <PanelBody>
              {core ? (
                <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                  <CharacterAvatar imageSrc={core.imageMono} alt={core.nameKo} size="lg" fallbackText={core.short} />
                  <div>
                    <p className="text-lg font-black text-gray-900">{core.nameKo}</p>
                    <p className="text-sm text-gray-600">이 코어는 모든 Goal/Todo 코칭에 공통 적용됩니다.</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">코어를 선택해 주세요.</p>
              )}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              <h2 className="text-lg font-extrabold text-gray-900">목표 목록</h2>
              <button type="button" onClick={() => setIsGoalModalOpen(true)} className="ui-btn-secondary">
                + 목표 추가
              </button>
            </PanelHeader>
            <PanelBody>
              {goals.length === 0 ? (
                <p className="text-sm text-gray-500">아직 목표가 없습니다.</p>
              ) : (
                <ul className="space-y-2">
                  {goals.map((goal) => {
                    const method = methodMeta[goal.goalType === "structured" ? "robot" : goal.methodMode];
                    const isActive = goal.id === activeGoalId;
                    const goalTypeLabel = goal.goalType === "structured" ? "구조형" : "탐색형";
                    const nextTodoPreview = nextTodoByGoal.get(goal.id);
                    return (
                      <li
                        key={goal.id}
                        className={[
                          "rounded-2xl border px-3 py-3 transition",
                          isActive ? "border-amber-300 bg-amber-50/70" : "border-amber-200 bg-white",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <button type="button" onClick={() => setActiveGoalId(goal.id)} className="text-left">
                            <p className="text-sm font-bold text-gray-900">{goal.title}</p>
                            <div className="mt-1 flex items-center gap-1">
                              <span className="ui-chip">{goalTypeLabel}</span>
                              {goal.goalType === "structured" ? (
                                <CharacterAvatar
                                  imageSrc={methodMeta.robot.imageMono}
                                  alt={methodMeta.robot.nameKo}
                                  size="sm"
                                  fallbackText={methodMeta.robot.short}
                                />
                              ) : null}
                            </div>
                            <p className="text-xs text-gray-500">Method: {method.nameKo}</p>
                            <p className="text-xs text-gray-500">Next 1: {nextTodoPreview ?? "아직 없음"}</p>
                          </button>

                          {goal.goalType === "exploratory" ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateGoalMethod(goal.id, "robot")}
                                className="ui-btn-secondary"
                              >
                                착착
                              </button>
                              <button
                                type="button"
                                onClick={() => updateGoalMethod(goal.id, "sparrow")}
                                className="ui-btn-secondary"
                              >
                                딴짓
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </div>
      </ScenePanel>

      <GoalCreateModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onCreate={(payload) => {
          addGoal(payload);
          setIsGoalModalOpen(false);
        }}
      />

      <CoreCoachModal
        isOpen={isCoreModalOpen}
        selectedCore={coreCoach}
        onSelect={(core) => {
          setCoreCoach(core);
          setIsCoreModalOpen(false);
        }}
        onClose={coreCoach ? () => setIsCoreModalOpen(false) : undefined}
      />
    </AppShell>
  );
}
