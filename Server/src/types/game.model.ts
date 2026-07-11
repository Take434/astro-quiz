export type Game = {
  host: string;
  state: HostStateValue;
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
  id: string;
  isHost: boolean;
  state: HostStateValue;
};
