import { create } from "zustand";

export enum HostStateValue {
  CreateGame,
  JoinGame,
  Question,
  QuestionReveal,
  Leaderboard,
  AwardCeremony,
}

export interface HostState {
  hostState: HostStateValue;
  players?: Player[];
  questionNr?: number;
  timer?: number;
  gameId?: number;
  setHostState: (state: HostStateValue) => void;
  setPlayers: (players: Player[]) => void;
  setTimer: (timer: number) => void;
  setGameId: (code: number) => void;
  setQuestionNr: (nr: number) => void;
}

export const useHostState = create<HostState>((set) => ({
  hostState: HostStateValue.CreateGame,
  setHostState: (state: HostStateValue) => set({ hostState: state }),
  setPlayers: (players: Player[]) => set({ players: players }),
  setTimer: (timer: number) => set({ timer: timer }),
  setGameId: (code: number) => set({ gameId: code }),
  setQuestionNr: (nr: number) => set({ questionNr: nr }),
}));

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
