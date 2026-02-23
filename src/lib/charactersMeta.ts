import type { CoreCoach, MethodMode } from "@/types/coach";

type CharacterVisualMeta = {
  nameKo: string;
  short: string;
  imageMono: string;
  imageColor: string;
};

export const coreMeta: Record<CoreCoach, CharacterVisualMeta> = {
  octopus: {
    nameKo: "미루문어",
    short: "미",
    imageMono: "/characters/core/octopus-mono.png",
    imageColor: "/characters/core/octopus-color.png",
  },
  worry: {
    nameKo: "걱정토리",
    short: "걱",
    imageMono: "/characters/core/worry-mono.png",
    imageColor: "/characters/core/worry-color.png",
  },
  boar: {
    nameKo: "돌진멧돼",
    short: "돌",
    imageMono: "/characters/core/boar-mono.png",
    imageColor: "/characters/core/boar-color.png",
  },
  lizard: {
    nameKo: "리셋도마",
    short: "리",
    imageMono: "/characters/core/lizard-mono.png",
    imageColor: "/characters/core/lizard-color.png",
  },
  whale: {
    nameKo: "잔잔고래",
    short: "잔",
    imageMono: "/characters/core/whale-mono.png",
    imageColor: "/characters/core/whale-color.png",
  },
  ghost: {
    nameKo: "감성유령",
    short: "감",
    imageMono: "/characters/core/ghost-mono.png",
    imageColor: "/characters/core/ghost-color.png",
  },
};

export const methodMeta: Record<MethodMode, CharacterVisualMeta> = {
  robot: {
    nameKo: "착착로봇",
    short: "착",
    imageMono: "/characters/method/robot-mono.png",
    imageColor: "/characters/method/robot-color.png",
  },
  sparrow: {
    nameKo: "딴짓참새",
    short: "딴",
    imageMono: "/characters/method/sparrow-mono.png",
    imageColor: "/characters/method/sparrow-color.png",
  },
};

