import { Socket } from "socket.io";
import { redisClient, redisGameStore } from "../redis";
import { Game, GameState, HostStateValue } from "../types/game.model";

export function registerHostHandlers(socket: Socket) {
  socket.on("game:host", async (data: HostGameEvent) => {
    const id = String(await redisClient.incr("game:id"));
    const sessionId = socket.request.session.id;
    await redisGameStore.set<Game>(
      String(id),
      (data ?? {}) && {
        host: sessionId,
        state: HostStateValue.JoinGame,
      },
    );
    socket.join(`game:${id}`);

    const game: GameState = {
      id: id,
      isHost: true,
      state: HostStateValue.JoinGame,
    };

    socket.emit("game:host", game);

    socket.request.session.gameId = String(id);
    await socket.request.session.save();
  });
}

type HostGameEvent = {};
