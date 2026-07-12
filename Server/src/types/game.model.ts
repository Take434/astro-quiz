export type Game = {
  host: string;
  quizId: number;
  state: HostStateValue;
  questionStep: number;
};

export enum HostStateValue {
  CreateGame,
  JoinGame,
  Question,
  QuestionReveal,
  Leaderboard,
  AwardCeremony,
}

export type GameState = {
  id: number;
  quizId: number;
  isHost: boolean;
  state: HostStateValue;
  questionStep: number;
};
