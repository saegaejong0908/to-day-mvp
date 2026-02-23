import type { CoreCoach, MethodMode } from "@/types/coach";

export type CoachHint = {
  headline: string;
  subline: string;
  cta: string;
  suggestions: Array<{ label: string; value: string }>;
};

const coreHintMap: Record<
  CoreCoach,
  {
    headline: string;
    cta: string;
  }
> = {
  octopus: {
    headline: "2분만 시작하면 관성이 붙어요.",
    cta: "2분만 시작",
  },
  worry: {
    headline: "완료 기준을 1줄로 줄이면 불안이 낮아져요.",
    cta: "완료기준 1줄",
  },
  boar: {
    headline: "타이머 15분으로 집중 돌진해봐요.",
    cta: "15분 돌진",
  },
  lizard: {
    headline: "리셋은 실패가 아니라 재시작 신호예요.",
    cta: "오늘 1개만",
  },
  whale: {
    headline: "작아도 누적되면 흐름이 만들어져요.",
    cta: "오늘 1%",
  },
  ghost: {
    headline: "감정을 이름 붙이면 다음 행동이 쉬워져요.",
    cta: "감정 1단어",
  },
};

const methodSublineMap: Record<MethodMode, string> = {
  robot: "하나만 잡고 체크 닫기",
  sparrow: "10분 탐색, 없으면 가장 쉬운 1스텝",
};

function normalizeTodoTitle(rawTitle: string): string {
  const prefixes = [
    "시작 전 1단계:",
    "지금 시작:",
    "완료 기준:",
    "15분 돌진:",
    "돌진 후 체크:",
    "오늘 1개:",
    "다시 시작:",
    "오늘 1%:",
    "하나만:",
    "하나만 잡고 체크:",
    "10분 탐색:",
    "2분만:",
  ];

  let next = rawTitle.trim();
  let changed = true;

  while (changed) {
    changed = false;
    for (const prefix of prefixes) {
      if (next.startsWith(prefix)) {
        next = next.slice(prefix.length).trim();
        changed = true;
      }
    }
  }

  next = next.replace(/\s*\(첫 행동\)\s*$/g, "").trim();
  next = next.replace(/\s*\(끝:\s*____\s*\)\s*$/g, "").trim();

  if (next.includes("->")) {
    next = next.split("->")[0].trim();
  }
  if (next.includes("/ 다음 1스텝:")) {
    const parts = next.split("/ 다음 1스텝:");
    next = (parts[1] ?? parts[0]).trim();
  }
  if (next.startsWith("지금 기분에 맞는 최소 행동:")) {
    next = next.replace("지금 기분에 맞는 최소 행동:", "").trim();
  }

  return next;
}

export function getCoachHint(
  core: CoreCoach,
  method: MethodMode,
  todoTitle: string,
): CoachHint {
  const coreHint = coreHintMap[core];
  const normalizedTitle = normalizeTodoTitle(todoTitle);
  const titleChunk = normalizedTitle.length > 0 ? `"${normalizedTitle}"` : "이 작업";
  const baseTask = normalizedTitle.length > 0 ? normalizedTitle : "가장 쉬운 1스텝";

  const coreSuggestionMap: Record<CoreCoach, Array<{ label: string; value: string }>> = {
    octopus: [
      { label: "마찰 줄이기", value: `시작 전 1단계: ${normalizedTitle || "도구 켜기"}` },
      { label: "첫 행동 쪼개기", value: `${baseTask} -> 10초 행동 1개` },
    ],
    worry: [
      { label: "끝 기준 1줄", value: `${normalizedTitle || "할 일"} (끝: ____ )` },
      { label: "불안 줄이기", value: `완료 기준: ${baseTask}까지` },
    ],
    boar: [
      { label: "15분 돌진", value: `15분 돌진: ${baseTask}` },
      { label: "브레이크 설정", value: `돌진 후 체크: ${baseTask}` },
    ],
    lizard: [
      { label: "오늘 1개만", value: `오늘 1개: ${baseTask}` },
      { label: "재시작 문장", value: `다시 시작: ${baseTask}` },
    ],
    whale: [
      { label: "오늘 1%", value: `오늘 1%: ${baseTask}` },
      { label: "하나만 닫기", value: `하나만: ${normalizedTitle || "가장 중요한 1개"}` },
    ],
    ghost: [
      { label: "감정 1단어", value: `지금 감정: ____ / 다음 1스텝: ${baseTask}` },
      { label: "기분-행동 연결", value: `지금 기분에 맞는 최소 행동: ${baseTask}` },
    ],
  };

  const methodSuggestionMap: Record<MethodMode, { label: string; value: string }> = {
    robot: {
      label: "체크 한 줄",
      value: `하나만 잡고 체크: ${baseTask}`,
    },
    sparrow: {
      label: "10분 탐색",
      value: `10분 탐색: ${normalizedTitle || "가장 재밌는 부분 찾기"}`,
    },
  };

  return {
    headline: `${titleChunk} 시작 전에: ${coreHint.headline}`,
    subline: `오늘 접근법: ${methodSublineMap[method]}`,
    cta: coreHint.cta,
    suggestions: [...coreSuggestionMap[core], methodSuggestionMap[method]],
  };
}
