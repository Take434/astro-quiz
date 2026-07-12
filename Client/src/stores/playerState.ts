import { create } from "zustand";

export enum PlayerStateValue {
  JoinGame,
  Question,
  Wait,
  AwardCeremony,
  Debug,
}

export interface PlayerState {
  playerState: PlayerStateValue;
  setPlayerState: (state: PlayerStateValue) => void;
}

export const usePlayerState = create<PlayerState>((set) => ({
  playerState: PlayerStateValue.Question,
  setPlayerState: (state: PlayerStateValue) => set({ playerState: state }),
}));
