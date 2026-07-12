import { RedisStore } from "connect-redis";
import { createClient, RedisClientType } from "redis";
import { Game } from "./types/game.model";

export const redisClient: RedisClientType = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("redis error:", err);
});

redisClient.on("connect", () => {
  // console.log("REDIS: connecting...");
});

redisClient.on("ready", () => {
  console.log("redis started");
});

export const redisSessionStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

export const redisGameStore = {
  async get(gameId: number): Promise<Game | null> {
    const data = await redisClient.get(`game:${gameId}`);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  },

  async set(gameId: number, game: Game) {
    await redisClient.set(`game:${gameId}`, JSON.stringify(game), {
      expiration: { type: "EX", value: 60 * 60 * 2 }, // expire after 2 hours
    });
  },

  async delete(gameId: number) {
    await redisClient.del(`game:${gameId}`);
  },
};
