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
      questionNr,
    }: {
      state: HostStateValue;
      question?: Question;
      players: Player[];
      timer: number;
      gameId: number;
      questionNr: number;
    }) => {
      hostState.setHostState(state);
      hostState.setPlayers(players);
      hostState.setTimer(timer);
      hostState.setGameId(gameId);
      hostState.setQuestionNr(questionNr);

      if (question) {
        questionState.setQuestionState(question);
      }
    },
  );
