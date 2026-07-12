import { PlayerStateValue } from "#/stores/playerState";
import type { Question } from "#/stores/questionState";
import type { Socket } from "socket.io-client";

export const registerPlayerStateChange = (
  socket: Socket,
  updateQuestionState: (state: Question) => void,
  updatePlayerState: (state: PlayerStateValue) => void,
) =>
  socket.on(
    "player:state",
    ({ state, question }: { state: PlayerStateValue; question?: Question }) => {
      updatePlayerState(state);

      if (state === PlayerStateValue.Question && question) {
        updateQuestionState(question);
      }
    },
  );
