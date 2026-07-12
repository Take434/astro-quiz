import express, { type Express, type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import session, { Session } from "express-session";
import { redisClient, redisGameStore, redisSessionStore } from "./redis";
import { registerPlayerHandlers } from "./services/player-service";
import { registerHostHandlers } from "./services/host-service";
import { Game, GameState } from "./types/game.model";
import { registerQuizHandlers } from "./services/quiz-service";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});

const port = 3000;
const MAX_AGE = 1000 * 60 * 60 * 24; // one Day timeout

const sessionMiddleware = session({
  name: "astroquiz.sid",
  store: redisSessionStore,
  secret: process.env.SESSION_SECRET ?? "heytheredelilah",
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  },
});

app.use(sessionMiddleware);

io.engine.use(sessionMiddleware);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  const session = socket.request.session;

  const persistSession = async () => {
    if (!session) {
      return;
    }

    const gameId = session.gameId;

    if (gameId) {
      const game = await redisGameStore.get<Game>(gameId);

      if (game) {
        socket.join(`game:${gameId}`);
        const gameState: GameState = {
          id: gameId,
          quizId: game.quizId,
          isHost: game.host === session.id,
          state: game.state,
          questionStep: game.questionStep,
        };
        socket.emit("game:rejoin", gameState);
      }
    }

    session.touch();
    await new Promise<void>((resolve, reject) => {
      session.save((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  };

  void persistSession();

  socket.on("session:log", async () => {
    console.log(session.gameId);
  });

  socket.on("console:clear", () => {
    console.clear();
  });

  socket.on("game:rejoin", async (value: boolean) => {
    if (!value) {
      socket.request.session.gameId = undefined;
      await socket.request.session.save();
    }
  });

  registerPlayerHandlers(socket, io);
  registerHostHandlers(socket, io);
  registerQuizHandlers(socket);
});

console.log("webserver started");

async function start() {
  try {
    await redisClient.connect();
    server.listen(port, () => {
      console.log("server running at http://localhost:" + port);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

declare module "express-session" {
  interface SessionData {
    user?: User;
  }
}

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      gameId?: number;
    };
  }
}

export type User = {
  gameId: number;
};
