"use client";

import CharacterAvatar from "@/components/CharacterAvatar";
import { coreMeta, methodMeta } from "@/lib/charactersMeta";
import { getCoachHint } from "@/lib/coach/getCoachHint";
import type { CoreCoach, MethodMode } from "@/types/coach";

type CoachHintProps = {
  coreCoach: CoreCoach | null;
  methodMode: MethodMode | null;
  todoTitle: string;
  onPickSuggestion: (value: string) => void;
  onUseSkill?: () => void;
  skillLabel?: string;
};

export default function CoachHint({
  coreCoach,
  methodMode,
  todoTitle,
  onPickSuggestion,
  onUseSkill,
  skillLabel,
}: CoachHintProps) {
  if (!coreCoach || !methodMode) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white/70 p-4 text-sm text-gray-500">
        코치 정보를 먼저 선택해 주세요.
      </div>
    );
  }

  const hint = getCoachHint(coreCoach, methodMode, todoTitle);
  const core = coreMeta[coreCoach];
  const method = methodMeta[methodMode];
  const compactSuggestions = hint.suggestions
    .filter((item, index, arr) => arr.findIndex((cand) => cand.label === item.label || cand.value === item.value) === index)
    .slice(0, 2);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
      <div className="mb-3 flex items-center gap-2">
        <CharacterAvatar imageSrc={core.imageMono} alt={core.nameKo} size="md" fallbackText={core.short} />
        <CharacterAvatar
          imageSrc={method.imageMono}
          alt={method.nameKo}
          size="md"
          fallbackText={method.short}
          className="border-amber-300"
        />
      </div>
      <p className="text-sm font-semibold text-gray-900">{hint.headline}</p>
      <p className="mt-1 text-sm text-gray-600">{hint.subline}</p>
      {skillLabel && onUseSkill ? (
        <button
          type="button"
          onClick={onUseSkill}
          className="mt-3 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600"
        >
          {skillLabel}
        </button>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {compactSuggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => onPickSuggestion(suggestion.value)}
            className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
