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
  players: Player[];
  timer?: number;
  setHostState: (state: HostStateValue) => void;
  setPlayers: (players: Player[]) => void;
  setTimer: (timer: number) => void;
}

export const useHostState = create<HostState>((set) => ({
  hostState: HostStateValue.CreateGame,
  players: [],
  setHostState: (state: HostStateValue) => set({ hostState: state }),
  setPlayers: (players: Player[]) => set({ players: players }),
  setTimer: (timer: number) => set({ timer: timer }),
}));

export type Player = {
  id: string;
  score: number;
  answerCount: number;
  username: string;
  icon: string;
};
