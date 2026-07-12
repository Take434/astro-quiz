export type Game = {
  host: string;
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
  isHost: boolean;
  state: HostStateValue;
  questionStep: number;
};
