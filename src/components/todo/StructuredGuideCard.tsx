"use client";

import { useState } from "react";

import CharacterAvatar from "@/components/CharacterAvatar";
import { methodMeta } from "@/lib/charactersMeta";

type StructuredGuideCardProps = {
  nextTodo?: { id: string; title: string } | null;
  onCreateNext?: (title: string) => void;
  onCompleteNext?: (todoId: string) => void;
  onFillInput?: (value: string) => void;
  onFocusInput?: () => void;
};

export default function StructuredGuideCard({
  nextTodo,
  onCreateNext,
  onCompleteNext,
  onFillInput,
  onFocusInput,
}: StructuredGuideCardProps) {
  const [draftTitle, setDraftTitle] = useState("");
  const robot = methodMeta.robot;

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white/70 p-4">
      <div className="mb-2 flex items-center gap-2">
        <CharacterAvatar imageSrc={robot.imageMono} alt={robot.nameKo} size="md" fallbackText={robot.short} />
        <div>
          <p className="text-sm font-black text-gray-900">착착로봇 가이드</p>
          <p className="text-xs text-gray-600">구조형 목표는 순서대로 하나씩 진행합니다.</p>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-white p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Next 1</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">
          {nextTodo ? nextTodo.title : "Next 1이 아직 없음"}
        </p>
        <p className="mt-1 text-xs text-gray-600">이것만 하면 돼.</p>
      </div>

      <div className="mt-3 flex gap-2">
        {nextTodo ? (
          <>
            <button
              type="button"
              onClick={() => onCompleteNext?.(nextTodo.id)}
              className="ui-btn-primary"
            >
              Next 1 완료
            </button>
            <button
              type="button"
              onClick={() => onFillInput?.(nextTodo.title)}
              className="ui-btn-chip"
            >
              Next 1로 입력 채우기
            </button>
          </>
        ) : (
          <div className="w-full space-y-2">
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Next 1 제목 입력"
              className="ui-input"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!draftTitle.trim()) {
                    return;
                  }
                  onCreateNext?.(draftTitle.trim());
                  setDraftTitle("");
                }}
                className="ui-btn-primary"
                disabled={!draftTitle.trim()}
              >
                Next 1 만들기
              </button>
              <button
                type="button"
                onClick={onFocusInput}
                className="ui-btn-chip"
              >
                백로그 추가로 이동
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
