"use client";

import { useEffect, useMemo, useState } from "react";

import type { Todo } from "@/types/coach";

type ResetModalProps = {
  isOpen: boolean;
  todos: Todo[];
  onClose: () => void;
  onConfirm: (keepTodoId: string) => void;
};

export default function ResetModal({ isOpen, todos, onClose, onConfirm }: ResetModalProps) {
  const candidates = useMemo(() => todos.filter((todo) => !todo.isDone && todo.paused !== true), [todos]);
  const [keepTodoId, setKeepTodoId] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setKeepTodoId("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900">리셋</h3>
            <p className="mt-1 text-sm text-gray-600">오늘 남길 1개를 고르면 나머지는 보류로 이동합니다.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-600"
          >
            닫기
          </button>
        </div>

        {candidates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
            리셋할 활성 투두가 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {candidates.map((todo) => (
              <label
                key={todo.id}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 py-2"
              >
                <input
                  type="radio"
                  name="keepTodo"
                  value={todo.id}
                  checked={keepTodoId === todo.id}
                  onChange={(event) => setKeepTodoId(event.target.value)}
                />
                <span className="text-sm text-gray-800">{todo.title}</span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!keepTodoId}
            onClick={() => {
              if (!keepTodoId) {
                return;
              }
              onConfirm(keepTodoId);
              setKeepTodoId("");
            }}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            나머지 보류 처리
          </button>
        </div>
      </div>
    </div>
  );
}
