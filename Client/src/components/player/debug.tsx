import { useSocketSession } from "#/socket/SocketSessionProvider";
import type { Socket } from "socket.io-client";

const joinGame = (socket: Socket) => {
  socket.emit("join", { roomId: "8", username: "günther" });
};

const logSession = (socket: Socket) => {
  socket.emit("session:log");
};

const clearConsole = (socket: Socket) => {
  socket.emit("console:clear");
};

const hostGame = (socket: Socket) => {
  console.log("hosting...");
  socket.emit("game:host");
};

export function PlayerDebug() {
  const { socket, gameId } = useSocketSession();
  console.log(gameId);
  return (
    <div className="flex flex-col">
      <button onClick={() => joinGame(socket)}>join</button>
      <button onClick={() => hostGame(socket)}>host</button>
      <button onClick={() => logSession(socket)}>print log</button>
      <button onClick={() => clearConsole(socket)}>clear log</button>
    </div>
  );
}
