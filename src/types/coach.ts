export type CoreCoach = "octopus" | "worry" | "boar" | "lizard" | "whale" | "ghost";

export type MethodMode = "robot" | "sparrow";
export type GoalType = "structured" | "exploratory";

export type Goal = {
  id: string;
  title: string;
  goalType: GoalType;
  methodMode: MethodMode;
  nextTodoId?: string | null;
  createdAt: number;
};

export type Todo = {
  id: string;
  goalId: string;
  title: string;
  isDone: boolean;
  createdAt: number;
  paused?: boolean;
};
