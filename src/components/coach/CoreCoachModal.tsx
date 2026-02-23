"use client";

import CharacterAvatar from "@/components/CharacterAvatar";
import { coreMeta } from "@/lib/charactersMeta";
import type { CoreCoach } from "@/types/coach";

type CoreCoachModalProps = {
  isOpen: boolean;
  selectedCore: CoreCoach | null;
  onSelect: (core: CoreCoach) => void;
  onClose?: () => void;
};

const coreOrder: CoreCoach[] = ["octopus", "worry", "boar", "lizard", "whale", "ghost"];

export default function CoreCoachModal({
  isOpen,
  selectedCore,
  onSelect,
  onClose,
}: CoreCoachModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900">내 코어 캐릭터 선택</h3>
            <p className="mt-1 text-sm text-gray-600">코어 캐릭터는 사용자 고정으로 적용됩니다.</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-600"
            >
              닫기
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {coreOrder.map((core) => {
            const meta = coreMeta[core];
            const isSelected = selectedCore === core;
            return (
              <button
                key={core}
                type="button"
                onClick={() => onSelect(core)}
                className={[
                  "rounded-xl border p-3 text-left transition",
                  isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
                ].join(" ")}
              >
                <div className="mb-2 flex items-center gap-2">
                  <CharacterAvatar
                    imageSrc={meta.imageMono}
                    alt={meta.nameKo}
                    size="sm"
                    fallbackText={meta.short}
                    className={isSelected ? "border-gray-500" : ""}
                  />
                  <span className="text-sm font-bold">{meta.nameKo}</span>
                </div>
                <span className={isSelected ? "text-xs text-gray-200" : "text-xs text-gray-500"}>내 고정 코어</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
