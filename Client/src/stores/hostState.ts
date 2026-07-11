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
  setHostState: (state: HostStateValue) => void;
}

export const useHostState = create<HostState>((set) => ({
  hostState: HostStateValue.CreateGame,
  setHostState: (state: HostStateValue) => set({ hostState: state }),
}));
