import type { Socket } from "socket.io-client";

export const hostGame = (socket: Socket) => {
  console.log("hosting...");
  socket.emit("game:host");
};

export const joinGame = (socket: Socket, gameId: string, username: string) => {
  socket.emit("game:join", { gameId: gameId, username: username });
};

export const rejoinGame = (socket: Socket) => {
  socket.emit("game:rejoin", true);
};
