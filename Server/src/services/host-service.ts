import { Socket } from "socket.io";
import { redisClient, redisGameStore } from "../redis";

export function registerHostHandlers(socket: Socket) {
  socket.on("game:host", async (data: HostGameEvent) => {
    const id = await redisClient.incr("game:id");
    const sessionId = socket.request.session.id;
    await redisGameStore.set(
      String(id),
      (data ?? {}) && {
        host: sessionId,
      },
    );
    socket.join(`game:${id}`);

    const game = {
      id: id,
      isHost: true,
    };

    socket.emit("game:host", game);

    socket.request.session.gameId = String(id);
    await socket.request.session.save();
  });
}

type HostGameEvent = {};
