"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import CharacterAvatar from "@/components/CharacterAvatar";
import CoreCoachModal from "@/components/coach/CoreCoachModal";
import GoalCreateModal from "@/components/todo/GoalCreateModal";
import { useGoals } from "@/hooks/useGoals";
import { useTodos } from "@/hooks/useTodos";
import { useUserCoreCoach } from "@/hooks/useUserCoreCoach";
import { coreMeta, methodMeta } from "@/lib/charactersMeta";

export default function GoalPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? session?.user?.email ?? undefined;
  const { goals, activeGoalId, setActiveGoalId, addGoal, updateGoalMethod, initialized: goalsReady } = useGoals(userId);
  const { coreCoach, setCoreCoach, initialized: coreReady } = useUserCoreCoach(userId);
  const { todos, initialized: todosReady } = useTodos(null, userId);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCoreModalOpen, setIsCoreModalOpen] = useState(false);

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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">to day mvp</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-900">목표</h1>
      </header>

      <section className="rounded-2xl border border-amber-200 bg-white/85 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900">내 코어 캐릭터</h2>
          <button
            type="button"
            onClick={() => setIsCoreModalOpen(true)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700"
          >
            변경
          </button>
        </div>

        {core ? (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-amber-50/60 p-4">
            <CharacterAvatar imageSrc={core.imageMono} alt={core.nameKo} size="lg" fallbackText={core.short} />
            <div>
              <p className="text-lg font-black text-gray-900">{core.nameKo}</p>
              <p className="text-sm text-gray-600">이 코어는 모든 Goal/Todo 코칭에 공통 적용됩니다.</p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">코어를 선택해 주세요.</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white/85 p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900">목표 목록</h2>
          <button
            type="button"
            onClick={() => setIsGoalModalOpen(true)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
          >
            + 목표 추가
          </button>
        </div>

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
                    "rounded-xl border px-3 py-3",
                    isActive ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <button type="button" onClick={() => setActiveGoalId(goal.id)} className="text-left">
                      <p className={isActive ? "text-sm font-bold text-white" : "text-sm font-bold text-gray-900"}>{goal.title}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span
                          className={[
                            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold",
                            isActive ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-600",
                          ].join(" ")}
                        >
                          {goalTypeLabel}
                        </span>
                        {goal.goalType === "structured" ? (
                          <CharacterAvatar
                            imageSrc={methodMeta.robot.imageMono}
                            alt={methodMeta.robot.nameKo}
                            size="sm"
                            fallbackText={methodMeta.robot.short}
                          />
                        ) : null}
                      </div>
                      <p className={isActive ? "text-xs text-gray-200" : "text-xs text-gray-500"}>Method: {method.nameKo}</p>
                      <p className={isActive ? "text-xs text-gray-200" : "text-xs text-gray-500"}>
                        Next 1: {nextTodoPreview ?? "아직 없음"}
                      </p>
                    </button>

                    {goal.goalType === "exploratory" ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateGoalMethod(goal.id, "robot")}
                          className="rounded-md border border-gray-300 px-2 py-1 text-xs font-semibold"
                        >
                          착착
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGoalMethod(goal.id, "sparrow")}
                          className="rounded-md border border-gray-300 px-2 py-1 text-xs font-semibold"
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
      </section>

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
    </main>
  );
}
