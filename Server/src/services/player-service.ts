import { Server, Socket } from "socket.io";
import { redisGameStore } from "../redis";

export function registerPlayerHandlers(socket: Socket, io: Server) {
  socket.on("join", async (data: JoinEvent) => {
    const game = await redisGameStore.get(data.roomId);
    console.log(game);

    socket.join(`game:${data.roomId}`);

    io.to(`game:${data.roomId}`).emit("player:joined", {
      player: data.username,
    });

    socket.request.session.gameid = data.roomId;
    await socket.request.session.save();
  });
}

type JoinEvent = { roomId: string; username: string };
