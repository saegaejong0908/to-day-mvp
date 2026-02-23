"use client";

import CharacterAvatar from "@/components/CharacterAvatar";
import { coreMeta, methodMeta } from "@/lib/charactersMeta";
import { getCoachHint } from "@/lib/coach/getCoachHint";
import type { CoreCoach, MethodMode } from "@/types/coach";

type CoachDeckProps = {
  coreCoach: CoreCoach | null;
  methodMode: MethodMode | null;
  todoTitle: string;
  onPickSuggestion: (value: string) => void;
  onUseSkill?: () => void;
  skillLabel?: string;
  notice?: string;
};

export default function CoachDeck({
  coreCoach,
  methodMode,
  todoTitle,
  onPickSuggestion,
  onUseSkill,
  skillLabel,
  notice,
}: CoachDeckProps) {
  if (!coreCoach || !methodMode) {
    return (
      <section className="ui-panel border-dashed border-amber-200">
        <h2 className="text-lg font-extrabold text-gray-900">코치 덱</h2>
        <p className="mt-2 text-sm text-gray-600">코어 캐릭터와 목표를 준비하면 코치가 활성화됩니다.</p>
      </section>
    );
  }

  const core = coreMeta[coreCoach];
  const method = methodMeta[methodMode];
  const hint = getCoachHint(coreCoach, methodMode, todoTitle);
  const compactSuggestions = hint.suggestions
    .filter((item, index, arr) => arr.findIndex((cand) => cand.label === item.label || cand.value === item.value) === index)
    .slice(0, 2);

  return (
    <section className="ui-panel">
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">Coach Deck</h2>

      <div className="relative mt-4 flex justify-center rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
        <CharacterAvatar imageSrc={core.imageMono} alt={core.nameKo} fallbackText={core.short} size="xl" />
        <div className="absolute bottom-3 right-3 rounded-full border border-amber-200 bg-white p-1">
          <CharacterAvatar imageSrc={method.imageMono} alt={method.nameKo} fallbackText={method.short} size="lg" />
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
        <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 border-l border-t border-amber-200 bg-amber-50/70" />
        <p className="text-sm font-semibold text-gray-900">{hint.headline}</p>
        <p className="mt-1 text-sm text-gray-600">{hint.subline}</p>
        <p className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-700">
          추천: {hint.cta}
        </p>

        {skillLabel && onUseSkill ? (
          <button
            type="button"
            onClick={onUseSkill}
            className="ui-btn-primary mt-3 w-full"
          >
            {skillLabel}
          </button>
        ) : null}

        {notice ? <p className="mt-2 text-xs font-medium text-amber-700">{notice}</p> : null}

        <div className="mt-3 flex flex-wrap gap-2">
          {compactSuggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => onPickSuggestion(suggestion.value)}
              className="ui-btn-chip"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
