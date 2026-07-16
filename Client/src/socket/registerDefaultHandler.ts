import {
  HostStateValue,
  type HostState,
  type Player,
} from "#/stores/hostState";
import type { QuestionState } from "#/stores/questionState";
import { toast } from "react-toastify";
import type { Socket } from "socket.io-client";
import { registerHostStateChange } from "./registerHostHandler";
import { registerPlayerStateChange } from "./registerPlayerHandler";
import { PlayerStateValue, type PlayerState } from "#/stores/playerState";

export const registerDefaultHandler = (
  socket: Socket,
  questionState: QuestionState,
  hostState: HostState,
  playerState: PlayerState,
) => {
  socket.removeAllListeners();
  socket.on("connect", () => {
    console.log("socket connection opened");
  });
  socket.on("disconnect", () => {
    console.log("socket connection closed");
  });
  socket.on("error", (message: string) => {
    toast.warn(message);
  });
  socket.on("game:players", (players: Player[]) => {
    hostState.setPlayers(players);
  });
  socket.on("game:ended", () => {
    hostState.setHostState(HostStateValue.CreateGame);
    playerState.setPlayerState(PlayerStateValue.JoinGame);
    hostState.setPlayers([]);
    registerDefaultHandler(socket, questionState, hostState, playerState);
  });
  registerGameRejoin(socket, questionState, hostState, playerState);
};

const registerGameRejoin = (
  socket: Socket,
  questionState: QuestionState,
  hostState: HostState,
  playerState: PlayerState,
) =>
  socket.on(
    "game:rejoin",
    ({ id, isHost }: { id: number; isHost: boolean }) => {
      const url = isHost ? "host:rejoin" : "player:rejoin";
      if (
        confirm("Du bist bereits in einem Spiel, möchtest du beitreten? " + id)
      ) {
        if (isHost) {
          registerHostStateChange(socket, questionState, hostState);
        } else {
          registerPlayerStateChange(
            socket,
            questionState.setQuestionState,
            playerState.setPlayerState,
            playerState.setPlayerAwardState,
          );
        }
        socket.emit(url, true);
      } else {
        socket.emit(url, false);
      }
    },
  );
