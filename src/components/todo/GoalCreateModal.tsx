"use client";

import { useMemo, useState } from "react";

import CharacterAvatar from "@/components/CharacterAvatar";
import { methodMeta } from "@/lib/charactersMeta";
import type { GoalType, MethodMode } from "@/types/coach";

type GoalCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    goalType: GoalType;
    methodMode: MethodMode;
  }) => void;
};

const methodOrder: MethodMode[] = ["robot", "sparrow"];

export default function GoalCreateModal({ isOpen, onClose, onCreate }: GoalCreateModalProps) {
  const [title, setTitle] = useState("");
  const [goalType, setGoalType] = useState<GoalType>("structured");
  const [selectedMethod, setSelectedMethod] = useState<MethodMode>("robot");

  const isValid = useMemo(() => title.trim().length > 0, [title]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900">목표 추가</h3>
            <p className="mt-1 text-sm text-gray-600">Goal은 메소드 모드를 갖는 실행 슬롯입니다.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-600"
          >
            닫기
          </button>
        </div>

        <label className="mb-3 block text-sm font-semibold text-gray-700" htmlFor="goal-title">
          목표 이름
        </label>
        <input
          id="goal-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="예: 영어 회화 루틴"
          className="mb-6 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-amber-300 focus:ring"
        />

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-gray-700">목표 타입</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGoalType("structured")}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                goalType === "structured"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
              ].join(" ")}
            >
              구조형
            </button>
            <button
              type="button"
              onClick={() => setGoalType("exploratory")}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                goalType === "exploratory"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
              ].join(" ")}
            >
              탐색형
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {goalType === "structured" ? "구조형: 하나씩 처리하는 목표" : "탐색형: 메소드 전환이 유연한 목표"}
          </p>
        </div>

        {goalType === "exploratory" ? (
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold text-gray-700">Method Mode 선택</p>
            <div className="grid grid-cols-2 gap-2">
              {methodOrder.map((method) => {
                const visual = methodMeta[method];
                const isSelected = method === selectedMethod;

                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={[
                      "rounded-xl border p-3 text-left text-sm transition",
                      isSelected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
                    ].join(" ")}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <CharacterAvatar
                        imageSrc={visual.imageMono}
                        alt={visual.nameKo}
                        size="sm"
                        fallbackText={visual.short}
                        className={isSelected ? "border-gray-500" : ""}
                      />
                      <div className="font-bold">{visual.nameKo}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={() => {
              if (!isValid) {
                return;
              }
              onCreate({
                title: title.trim(),
                goalType,
                methodMode: goalType === "structured" ? "robot" : selectedMethod,
              });
              setTitle("");
              setGoalType("structured");
              setSelectedMethod("robot");
            }}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
