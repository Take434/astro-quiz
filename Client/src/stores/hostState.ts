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
  leaderboard?: PlayerScores[];
  setHostState: (state: HostStateValue) => void;
  setLeaderboard: (leaderboard: PlayerScores[]) => void;
}

export const useHostState = create<HostState>((set) => ({
  hostState: HostStateValue.CreateGame,
  setHostState: (state: HostStateValue) => set({ hostState: state }),
  setLeaderboard: (leaderboard: PlayerScores[]) =>
    set({ leaderboard: leaderboard }),
}));

export type PlayerScores = {
  username: string;
  score: number;
};
