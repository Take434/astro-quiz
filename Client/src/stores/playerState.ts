import type { GameResults } from "#/socket/registerPlayerHandler";
import { create } from "zustand";

export enum PlayerStateValue {
  JoinGame,
  Question,
  Wait,
  AwardCeremony,
}

export interface PlayerState {
  playerState: PlayerStateValue;
  playerAwardState?: GameResults;
  setPlayerState: (state: PlayerStateValue) => void;
  setPlayerAwardState: (state: GameResults) => void;
}

export const usePlayerState = create<PlayerState>((set) => ({
  playerState: PlayerStateValue.JoinGame,
  setPlayerState: (state: PlayerStateValue) => set({ playerState: state }),
  setPlayerAwardState: (state: GameResults) => set({ playerAwardState: state }),
}));
