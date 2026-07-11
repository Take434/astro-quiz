import { rootRoute } from "#/app";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { createRoute } from "@tanstack/react-router";
import type { Socket } from "socket.io-client";

export const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play",
  component: RouteComponent,
});

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

function RouteComponent() {
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
