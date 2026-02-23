"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import CoreCoachModal from "@/components/coach/CoreCoachModal";
import CoachDeck from "@/components/todo/CoachDeck";
import GoalCreateModal from "@/components/todo/GoalCreateModal";
import GoalsBar from "@/components/todo/GoalsBar";
import ResetModal from "@/components/todo/ResetModal";
import StructuredGuideCard from "@/components/todo/StructuredGuideCard";
import { useGoals } from "@/hooks/useGoals";
import { useTodos } from "@/hooks/useTodos";
import { useUserCoreCoach } from "@/hooks/useUserCoreCoach";

export default function TodoPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? session?.user?.email ?? undefined;

  const {
    goals,
    activeGoal,
    activeGoalId,
    setActiveGoalId,
    addGoal,
    updateGoalMethod,
    setNextTodoId,
    initialized: goalsReady,
  } = useGoals(userId);
  const { coreCoach, setCoreCoach, initialized: coreReady } = useUserCoreCoach(userId);

  const {
    activeTodosByActiveGoal,
    pausedTodosByActiveGoal,
    addTodo,
    toggleDone,
    updateTodoTitle,
    removeTodo,
    setTodoPaused,
    pauseTodosExcept,
    getNextCandidate,
    todosByActiveGoal,
    initialized: todosReady,
  } = useTodos(activeGoalId, userId);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCoreModalOpen, setIsCoreModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showPausedTodos, setShowPausedTodos] = useState(false);
  const [showStructuredBacklog, setShowStructuredBacklog] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [skillNotice, setSkillNotice] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const todoInputRef = useRef<HTMLInputElement>(null);

  const isReady = goalsReady && todosReady && coreReady;

  useEffect(() => {
    if (isReady && goals.length === 0) {
      setIsGoalModalOpen(true);
    }
  }, [isReady, goals.length]);

  useEffect(() => {
    if (isReady && !coreCoach) {
      setIsCoreModalOpen(true);
    }
  }, [isReady, coreCoach]);

  useEffect(() => {
    if (!skillNotice) {
      return;
    }
    const timer = window.setTimeout(() => {
      setSkillNotice("");
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [skillNotice]);

  useEffect(() => {
    setShowStructuredBacklog(false);
  }, [activeGoalId]);

  const canSubmitTodo = useMemo(
    () => Boolean(activeGoalId && todoTitle.trim().length > 0),
    [activeGoalId, todoTitle],
  );

  const hasDuplicateActiveTodo = (title: string) => {
    const normalized = title.trim();
    if (!normalized) {
      return false;
    }

    return activeTodosByActiveGoal.some(
      (todo) => !todo.isDone && todo.paused !== true && todo.title.trim() === normalized,
    );
  };

  const handleCreateTodo = () => {
    if (!activeGoalId || !todoTitle.trim()) {
      return;
    }

    const normalized = todoTitle.trim();
    if (hasDuplicateActiveTodo(normalized)) {
      setSkillNotice("같은 투두가 이미 있어요.");
      return;
    }

    addTodo(activeGoalId, normalized);
    setTodoTitle("");
  };

  const handleUseSkill = () => {
    if (!activeGoalId || !activeGoal || !coreCoach) {
      return;
    }

    if (coreCoach === "octopus") {
      const hasActiveMicroTodo = activeTodosByActiveGoal.some(
        (todo) => todo.title.startsWith("2분만:") && !todo.isDone && todo.paused !== true,
      );
      if (hasActiveMicroTodo) {
        setSkillNotice("이미 2분 시작 투두가 있어요.");
        return;
      }
      const microTitle = todoTitle.trim()
        ? `2분만: ${todoTitle.trim()} (첫 행동)`
        : "2분만: 준비물 꺼내기";
      if (hasDuplicateActiveTodo(microTitle)) {
        setSkillNotice("같은 투두가 이미 있어요.");
        return;
      }
      addTodo(activeGoalId, microTitle);
      setTodoTitle("");
      todoInputRef.current?.focus();
      return;
    }

    if (coreCoach === "lizard") {
      setIsResetModalOpen(true);
    }
  };

  const startEditTodo = (todoId: string, currentTitle: string) => {
    setEditingTodoId(todoId);
    setEditingTitle(currentTitle);
  };

  const cancelEditTodo = () => {
    setEditingTodoId(null);
    setEditingTitle("");
  };

  const saveEditTodo = () => {
    if (!editingTodoId || !editingTitle.trim()) {
      return;
    }
    updateTodoTitle(editingTodoId, editingTitle.trim());
    cancelEditTodo();
  };

  const handleRemoveTodo = (todoId: string) => {
    removeTodo(todoId);
    if (editingTodoId === todoId) {
      cancelEditTodo();
    }
  };

  const skillLabel = useMemo(() => {
    if (!coreCoach) {
      return undefined;
    }
    if (coreCoach === "octopus") {
      return "2분 시작";
    }
    if (coreCoach === "lizard") {
      return "리셋";
    }
    return undefined;
  }, [coreCoach]);

  const methodForDisplay = useMemo(() => {
    if (!activeGoal) {
      return null;
    }
    return activeGoal.goalType === "structured" ? "robot" : activeGoal.methodMode;
  }, [activeGoal]);

  const nextStructuredTodo = useMemo(() => {
    if (!activeGoal || activeGoal.goalType !== "structured") {
      return null;
    }
    if (activeGoal.nextTodoId) {
      const fixedNextTodo = todosByActiveGoal.find((todo) => todo.id === activeGoal.nextTodoId);
      if (fixedNextTodo && !fixedNextTodo.isDone && fixedNextTodo.paused !== true) {
        return fixedNextTodo;
      }
    }
    return getNextCandidate(activeGoal.id);
  }, [activeGoal, todosByActiveGoal, getNextCandidate]);

  useEffect(() => {
    if (!activeGoal || activeGoal.goalType !== "structured") {
      return;
    }
    const fixedId = activeGoal.nextTodoId ?? null;
    const nextId = nextStructuredTodo?.id ?? null;
    if (fixedId !== nextId) {
      setNextTodoId(activeGoal.id, nextId);
    }
  }, [activeGoal, nextStructuredTodo, setNextTodoId]);

  if (status === "loading" || !userId) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-4 px-6 py-8">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">to day mvp</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-900">투두</h1>
      </header>

      <GoalsBar
        goals={goals}
        activeGoalId={activeGoalId}
        onSelectGoal={setActiveGoalId}
        onClickAdd={() => setIsGoalModalOpen(true)}
      />

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4">
          <CoachDeck
            coreCoach={coreCoach}
            methodMode={methodForDisplay}
            todoTitle={todoTitle}
            onPickSuggestion={setTodoTitle}
            onUseSkill={handleUseSkill}
            skillLabel={skillLabel}
            notice={skillNotice}
          />

          {activeGoal?.goalType === "structured" ? (
            <StructuredGuideCard
              nextTodoTitle={nextStructuredTodo?.title}
              onCreateNext={(title) => {
                if (!activeGoalId || !activeGoal) {
                  return;
                }
                if (hasDuplicateActiveTodo(title)) {
                  setSkillNotice("같은 투두가 이미 있어요.");
                  return;
                }
                const created = addTodo(activeGoalId, title);
                setNextTodoId(activeGoal.id, created.id);
                setTodoTitle("");
              }}
              onCompleteNext={() => {
                if (!activeGoal || !nextStructuredTodo) {
                  return;
                }
                toggleDone(nextStructuredTodo.id);
                const nextCandidate = getNextCandidate(activeGoal.id, nextStructuredTodo.id);
                setNextTodoId(activeGoal.id, nextCandidate?.id ?? null);
              }}
              onFillInput={(value) => setTodoTitle(value)}
              onFocusInput={() => todoInputRef.current?.focus()}
            />
          ) : null}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">투두 추가</h2>
              <span className="text-xs font-semibold text-gray-500">
                현재 Goal: {activeGoal ? activeGoal.title : "없음"}
              </span>
            </div>

            {activeGoal && activeGoal.goalType === "exploratory" ? (
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => updateGoalMethod(activeGoal.id, "robot")}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                >
                  착착 불러오기
                </button>
                <button
                  type="button"
                  onClick={() => updateGoalMethod(activeGoal.id, "sparrow")}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                >
                  딴짓 불러오기
                </button>
              </div>
            ) : null}

            {goals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                Goal이 없습니다. 먼저 목표를 생성해 코치를 소환하세요.
              </div>
            ) : activeGoal?.goalType === "structured" ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowStructuredBacklog((prev) => !prev)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                >
                  백로그 추가(나중) {showStructuredBacklog ? "접기" : "펼치기"}
                </button>
                {showStructuredBacklog ? (
                  <div className="space-y-3">
                    <input
                      ref={todoInputRef}
                      value={todoTitle}
                      onChange={(event) => setTodoTitle(event.target.value)}
                      placeholder="백로그 할 일 추가"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-amber-300 focus:ring"
                    />
                    <button
                      type="button"
                      disabled={!canSubmitTodo}
                      onClick={handleCreateTodo}
                      className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      백로그 추가
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  ref={todoInputRef}
                  value={todoTitle}
                  onChange={(event) => setTodoTitle(event.target.value)}
                  placeholder="예: 10분 영어 쉐도잉"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-amber-300 focus:ring"
                />
                <button
                  type="button"
                  disabled={!canSubmitTodo}
                  onClick={handleCreateTodo}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Todo 생성
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-extrabold text-gray-900">Goal Todo 목록</h2>

            {!isReady ? (
              <p className="text-sm text-gray-500">불러오는 중...</p>
            ) : activeTodosByActiveGoal.length === 0 ? (
              <p className="text-sm text-gray-500">아직 투두가 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {activeTodosByActiveGoal.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
                  >
                    {editingTodoId === todo.id ? (
                      <input
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        className="mr-2 w-full rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none ring-amber-300 focus:ring"
                      />
                    ) : (
                      <span className={todo.isDone ? "text-sm text-gray-400 line-through" : "text-sm text-gray-800"}>
                        {todo.title}
                      </span>
                    )}
                    <div className="ml-2 flex items-center gap-1">
                      {editingTodoId === todo.id ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEditTodo}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditTodo}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleDone(todo.id)}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                          >
                            {todo.isDone ? "되돌리기" : "완료"}
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditTodo(todo.id, todo.title)}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTodo(todo.id)}
                            className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setShowPausedTodos((prev) => !prev)}
                className="text-sm font-semibold text-gray-700"
              >
                보류됨 ({pausedTodosByActiveGoal.length}) {showPausedTodos ? "접기" : "펼치기"}
              </button>

              {showPausedTodos && (
                <ul className="mt-2 space-y-2">
                  {pausedTodosByActiveGoal.length === 0 ? (
                    <li className="text-sm text-gray-500">보류된 투두가 없습니다.</li>
                  ) : (
                    pausedTodosByActiveGoal.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                      >
                        {editingTodoId === todo.id ? (
                          <input
                            value={editingTitle}
                            onChange={(event) => setEditingTitle(event.target.value)}
                            className="mr-2 w-full rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none ring-amber-300 focus:ring"
                          />
                        ) : (
                          <span className="text-sm text-gray-600">{todo.title}</span>
                        )}
                        <div className="ml-2 flex items-center gap-1">
                          {editingTodoId === todo.id ? (
                            <>
                              <button
                                type="button"
                                onClick={saveEditTodo}
                                className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                              >
                                저장
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditTodo}
                                className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setTodoPaused(todo.id, false)}
                                className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                              >
                                되살리기
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditTodo(todo.id, todo.title)}
                                className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700"
                              >
                                수정
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveTodo(todo.id)}
                                className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600"
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

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

      <ResetModal
        isOpen={isResetModalOpen}
        todos={activeTodosByActiveGoal}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={(keepTodoId) => {
          if (!activeGoalId) {
            return;
          }
          pauseTodosExcept(activeGoalId, keepTodoId);
          setIsResetModalOpen(false);
        }}
      />
    </main>
  );
}
