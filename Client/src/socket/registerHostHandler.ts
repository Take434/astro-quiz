import {
  HostStateValue,
  type HostState,
  type Player,
} from "#/stores/hostState";
import type { Question, QuestionState } from "#/stores/questionState";
import type { Socket } from "socket.io-client";

export const registerHostStateChange = (
  socket: Socket,
  questionState: QuestionState,
  hostState: HostState,
) =>
  socket.on(
    "host:state",
    ({
      state,
      question,
      players,
      timer,
      gameId,
    }: {
      state: HostStateValue;
      question?: Question;
      players: Player[];
      timer: number;
      gameId: number;
    }) => {
      console.log(question);
      hostState.setHostState(state);
      hostState.setPlayers(players);
      hostState.setTimer(timer);
      hostState.setGameId(gameId);

      if (question) {
        questionState.setQuestionState(question);
      }
    },
  );
