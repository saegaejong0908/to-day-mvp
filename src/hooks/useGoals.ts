"use client";

import { useEffect, useMemo, useState } from "react";

import { loadJSON, saveJSON } from "@/lib/storage/localStore";
import type { Goal, GoalType, MethodMode } from "@/types/coach";

const GOALS_KEY_PREFIX = "toDay.goals.v1";
const ACTIVE_GOAL_KEY_PREFIX = "toDay.activeGoalId.v1";

function getGoalsKey(userId: string | undefined) {
  return userId ? `${GOALS_KEY_PREFIX}.${userId}` : null;
}
function getActiveGoalKey(userId: string | undefined) {
  return userId ? `${ACTIVE_GOAL_KEY_PREFIX}.${userId}` : null;
}

type AddGoalInput = {
  title: string;
  goalType: GoalType;
  methodMode: MethodMode;
};

type LegacyGoal = Partial<Goal> & {
  id: string;
  title: string;
  coreCoach?: string;
};

function migrateGoals(rawGoals: LegacyGoal[]): Goal[] {
  return rawGoals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    goalType: goal.goalType ?? "structured",
    methodMode: goal.methodMode ?? "robot",
    nextTodoId: goal.nextTodoId ?? null,
    createdAt: goal.createdAt ?? Date.now(),
  }));
}

export function useGoals(userId?: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const goalsKey = getGoalsKey(userId);
  const activeGoalKey = getActiveGoalKey(userId);

  useEffect(() => {
    if (!goalsKey || !activeGoalKey) {
      setInitialized(true);
      return;
    }
    const savedGoals = loadJSON<LegacyGoal[]>(goalsKey, []);
    const savedActiveGoalId = loadJSON<string | null>(activeGoalKey, null);

    setGoals(migrateGoals(savedGoals));
    setActiveGoalId(savedActiveGoalId);
    setInitialized(true);
  }, [goalsKey, activeGoalKey]);

  useEffect(() => {
    if (!initialized || !goalsKey) {
      return;
    }

    saveJSON(goalsKey, goals);
  }, [goals, initialized, goalsKey]);

  useEffect(() => {
    if (!initialized || !activeGoalKey) {
      return;
    }

    saveJSON(activeGoalKey, activeGoalId);
  }, [activeGoalId, initialized, activeGoalKey]);

  useEffect(() => {
    if (!goals.length) {
      if (activeGoalId !== null) {
        setActiveGoalId(null);
      }
      return;
    }

    if (!activeGoalId || !goals.some((goal) => goal.id === activeGoalId)) {
      setActiveGoalId(goals[0].id);
    }
  }, [goals, activeGoalId]);

  const activeGoal = useMemo(
    () => goals.find((goal) => goal.id === activeGoalId) ?? null,
    [goals, activeGoalId],
  );

  const addGoal = ({ title, goalType, methodMode }: AddGoalInput): Goal => {
    const nextGoal: Goal = {
      id: crypto.randomUUID(),
      title,
      goalType,
      methodMode,
      nextTodoId: null,
      createdAt: Date.now(),
    };

    setGoals((prev) => [nextGoal, ...prev]);
    setActiveGoalId(nextGoal.id);

    return nextGoal;
  };

  const updateGoalMethod = (goalId: string, methodMode: MethodMode) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              methodMode,
            }
          : goal,
      ),
    );
  };

  const setNextTodoId = (goalId: string, todoId: string | null) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              nextTodoId: todoId,
            }
          : goal,
      ),
    );
  };

  return {
    goals,
    activeGoal,
    activeGoalId,
    setActiveGoalId,
    addGoal,
    updateGoalMethod,
    setNextTodoId,
    initialized,
  };
}
