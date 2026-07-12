import type { Socket } from "socket.io-client";

export const hostGame = (socket: Socket, quizId: number) => {
  console.log("hosting...");
  socket.emit("game:host", quizId);
};

export const joinGame = (socket: Socket, gameId: string, username: string) => {
  socket.emit("game:join", { gameId: gameId, username: username });
};

export const rejoinGame = (socket: Socket) => {
  socket.emit("game:rejoin", true);
};

/**updated game state according to backend state machine */
export const continueGame = (socket: Socket, callback: (data: any) => void) => {
  socket.emit("game:continue", {}, callback);
};
