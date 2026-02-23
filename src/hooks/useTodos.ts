"use client";

import { useEffect, useMemo, useState } from "react";

import { loadJSON, saveJSON } from "@/lib/storage/localStore";
import type { Todo } from "@/types/coach";

const TODOS_KEY_PREFIX = "toDay.todos.v1";

function getTodosKey(userId: string | undefined) {
  return userId ? `${TODOS_KEY_PREFIX}.${userId}` : null;
}

export function useTodos(activeGoalId: string | null, userId?: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialized, setInitialized] = useState(false);
  const storageKey = getTodosKey(userId);

  useEffect(() => {
    if (!storageKey) {
      setInitialized(true);
      return;
    }
    const savedTodos = loadJSON<Todo[]>(storageKey, []);
    setTodos(savedTodos.map((todo) => ({ ...todo, paused: todo.paused ?? false })));
    setInitialized(true);
  }, [storageKey]);

  useEffect(() => {
    if (!initialized || !storageKey) {
      return;
    }

    saveJSON(storageKey, todos);
  }, [todos, initialized, storageKey]);

  const addTodo = (goalId: string, title: string): Todo => {
    const nextTodo: Todo = {
      id: crypto.randomUUID(),
      goalId,
      title,
      isDone: false,
      paused: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [nextTodo, ...prev]);
    return nextTodo;
  };

  const toggleDone = (todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              isDone: !todo.isDone,
            }
          : todo,
      ),
    );
  };

  const setTodoPaused = (todoId: string, paused: boolean) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              paused,
            }
          : todo,
      ),
    );
  };

  const updateTodoTitle = (todoId: string, title: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              title,
            }
          : todo,
      ),
    );
  };

  const removeTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  };

  const pauseTodosExcept = (goalId: string, keepTodoId: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.goalId !== goalId || todo.isDone) {
          return todo;
        }
        if (todo.id === keepTodoId) {
          return { ...todo, paused: false };
        }
        return { ...todo, paused: true };
      }),
    );
  };

  const todosByActiveGoal = useMemo(() => {
    if (!activeGoalId) {
      return [];
    }
    return todos.filter((todo) => todo.goalId === activeGoalId);
  }, [activeGoalId, todos]);

  const activeTodosByActiveGoal = useMemo(
    () => todosByActiveGoal.filter((todo) => todo.paused !== true),
    [todosByActiveGoal],
  );

  const pausedTodosByActiveGoal = useMemo(
    () => todosByActiveGoal.filter((todo) => todo.paused === true),
    [todosByActiveGoal],
  );

  const getNextCandidate = (goalId: string, excludeTodoId?: string): Todo | undefined => {
    const candidates = todos
      .filter(
        (todo) =>
          todo.goalId === goalId &&
          todo.id !== excludeTodoId &&
          !todo.isDone &&
          todo.paused !== true,
      )
      .sort((a, b) => a.createdAt - b.createdAt);

    return candidates[0];
  };

  return {
    todos,
    todosByActiveGoal,
    activeTodosByActiveGoal,
    pausedTodosByActiveGoal,
    addTodo,
    toggleDone,
    updateTodoTitle,
    removeTodo,
    setTodoPaused,
    pauseTodosExcept,
    getNextCandidate,
    initialized,
  };
}
