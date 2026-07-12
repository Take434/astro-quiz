export type Game = {
  host: string;
  quizId: number;
  state: HostStateValue;
  questionStep: number;
  players: Player[];
};

export type Player = {
  id: string;
  score: number;
  answerCount: number;
  username: string;
};

export enum HostStateValue {
  CreateGame,
  JoinGame,
  Question,
  QuestionReveal,
  Leaderboard,
  AwardCeremony,
}

export enum PlayerStateValue {
  JoinGame,
  Question,
  Wait,
  AwardCeremony,
  Debug,
}

export type GameState = {
  id: number;
  quizId: number;
  isHost: boolean;
  state: HostStateValue;
  questionStep: number;
};
