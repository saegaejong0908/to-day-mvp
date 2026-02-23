export type CharacterType = "core" | "method";

export type CharacterMeta = {
  id: string;
  type: CharacterType;
  nameKo: string;
  oneLine: string;
  imageSrc: string;
  accent?: string;
};

export const coreCharacters: CharacterMeta[] = [
  {
    id: "core_octopus",
    type: "core",
    nameKo: "미루문어",
    oneLine: "해야 할 일을 자꾸 내일로 미루는 타입",
    imageSrc: "/characters/core/octopus.png",
    accent: "#f59e0b",
  },
  {
    id: "core_worry",
    type: "core",
    nameKo: "걱정토리",
    oneLine: "시작 전에 걱정이 먼저 앞서는 타입",
    imageSrc: "/characters/core/worry.png",
    accent: "#38bdf8",
  },
  {
    id: "core_boar",
    type: "core",
    nameKo: "돌진멧돼",
    oneLine: "계획 없이 바로 돌진하는 타입",
    imageSrc: "/characters/core/boar.png",
    accent: "#f97316",
  },
  {
    id: "core_reset",
    type: "core",
    nameKo: "리셋도마",
    oneLine: "작심삼일 후 다시 초기화되는 타입",
    imageSrc: "/characters/core/reset.png",
    accent: "#a78bfa",
  },
  {
    id: "core_whale",
    type: "core",
    nameKo: "잔잔고래",
    oneLine: "느리지만 꾸준히 흐름을 타는 타입",
    imageSrc: "/characters/core/whale.png",
    accent: "#2dd4bf",
  },
  {
    id: "core_ghost",
    type: "core",
    nameKo: "감성유령",
    oneLine: "기분에 따라 몰입도가 크게 달라지는 타입",
    imageSrc: "/characters/core/ghost.png",
    accent: "#f472b6",
  },
];

export const methodCharacters: CharacterMeta[] = [
  {
    id: "method_robot",
    type: "method",
    nameKo: "착착로봇",
    oneLine: "체크리스트를 순서대로 수행하는 실행 모드",
    imageSrc: "/characters/method/robot.png",
    accent: "#22c55e",
  },
  {
    id: "method_sparrow",
    type: "method",
    nameKo: "딴짓참새",
    oneLine: "딴짓을 빠르게 포착해 본작업으로 복귀하는 모드",
    imageSrc: "/characters/method/sparrow.png",
    accent: "#0ea5e9",
  },
];
