import { PlayerStateValue } from "#/stores/playerState";
import type { Question } from "#/stores/questionState";
import type { Socket } from "socket.io-client";

export type GameResults = {
  score: number;
  maxScore: number;
  placement: number;
  players: number;
};

export const registerPlayerStateChange = (
  socket: Socket,
  updateQuestionState: (state: Question) => void,
  updatePlayerState: (state: PlayerStateValue) => void,
  updatePlayerAwardState: (state: GameResults) => void,
) =>
  socket.on(
    "player:state",
    ({
      state,
      question,
      gameResults,
    }: {
      state: PlayerStateValue;
      question?: Question;
      gameResults?: GameResults;
    }) => {
      updatePlayerState(state);

      if (state === PlayerStateValue.Question && question) {
        updateQuestionState(question);
      }

      if (state === PlayerStateValue.AwardCeremony && gameResults) {
        updatePlayerAwardState(gameResults);
      }
    },
  );
