export type Game = {
  host: string;
  quizId: number;
  state: HostStateValue;
  questionStep: number;
  players: Player[];
  timer?: number;
};

export type Player = {
  id: string;
  score: number;
  lastScore?: number;
  lastAnswerIds?: number[];
  lastText?: string;
  answerCount: number;
  username: string;
  icon: string;
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
  QuestionReveal,
}

export type GameState = {
  id: number;
  quizId: number;
  isHost: boolean;
  state: HostStateValue;
  questionStep: number;
};

export type GameResults = {
  score: number;
  maxScore: number;
  placement: number;
  players: number;
};
