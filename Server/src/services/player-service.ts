import { Server, Socket } from "socket.io";
import { redisGameStore } from "../redis";

export function registerPlayerHandlers(socket: Socket, io: Server) {
  registerGameJoin(socket, io);
}

const registerGameJoin = (socket: Socket, io: Server) =>
  socket.on("game:join", async (data: JoinEvent) => {
    const game = await redisGameStore.get(data.gameId);

    if (game) {
      socket.join(`game:${data.gameId}`);

      io.to(`game:${data.gameId}`).emit("player:joined", {
        player: data.username,
      });

      socket.request.session.gameId = data.gameId;
      await socket.request.session.save();
    }
  });

type JoinEvent = { gameId: number; username: string };
