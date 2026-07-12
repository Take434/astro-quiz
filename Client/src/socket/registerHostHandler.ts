import { HostStateValue, type Player } from "#/stores/hostState";
import type { Question } from "#/stores/questionState";
import type { Socket } from "socket.io-client";

export const registerHostStateChange = (
  socket: Socket,
  updateQuestionState: (state: Question) => void,
  updateHostState: (state: HostStateValue) => void,
  updatePlayerState: (state: Player[]) => void,
  updateTimer: (timer: number) => void,
) =>
  socket.on(
    "host:state",
    ({
      state,
      question,
      players,
      timer,
    }: {
      state: HostStateValue;
      question?: Question;
      players: Player[];
      timer: number;
    }) => {
      updateHostState(state);
      updatePlayerState(players);
      updateTimer(timer);

      if (state === HostStateValue.Question && question) {
        updateQuestionState(question);
      }
    },
  );

export const registerPlayers = (
  socket: Socket,
  updatePlayers: (players: Player[]) => void,
) =>
  socket.on("game:players", (players: Player[]) => {
    updatePlayers(players);
  });
