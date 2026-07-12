import { Server, Socket } from "socket.io";
import { redisClient, redisGameStore } from "../redis";
import {
  Game,
  GameState,
  HostStateValue,
  PlayerStateValue,
} from "../types/game.model";
import { getAllQuizzes } from "./quiz-service";

export function registerHostHandlers(socket: Socket, io: Server) {
  registerHostGame(socket);
  registerContinueGame(socket, io);
}

const registerHostGame = (socket: Socket) =>
  socket.on("game:host", async (quizId: number) => {
    const id = await redisClient.incr("game:id");
    const sessionId = socket.request.session.id;
    await redisGameStore.set(id, {
      host: sessionId,
      quizId: quizId,
      state: HostStateValue.JoinGame,
      questionStep: 0,
      players: [],
    });
    socket.join(`game:${id}`);

    const game: GameState = {
      id: id,
      quizId: quizId,
      isHost: true,
      state: HostStateValue.JoinGame,
      questionStep: 0,
    };

    console.log("GAME:HOSTED:" + id);

    socket.emit("game:host", game);

    socket.request.session.gameId = id;
    await socket.request.session.save();
  });

const registerContinueGame = (socket: Socket, io: Server) =>
  socket.on("game:continue", async () => {
    const gameId = socket.request.session.gameId;

    if (gameId === undefined) {
      return;
    }

    console.log("gameId:", gameId);
    const game = await redisGameStore.get(gameId);
    console.log(game);

    if (!game || game.host != socket.request.session.id) {
      return;
    }

    const quiz = (await getAllQuizzes()).find(
      (item) => item.id === game.quizId,
    );

    let question = undefined;

    switch (game.state) {
      case HostStateValue.JoinGame:
        game.state = HostStateValue.Question;
        question = quiz?.questions[game.questionStep];
        if (question) {
          socket.emit("host:state", {
            state: HostStateValue.Question,
            question: question,
          });
          io.to(`game:${gameId}`).emit("player:state", {
            state: PlayerStateValue.Question,
            question: question,
          });
        }
        break;
      case HostStateValue.Question:
        game.state = HostStateValue.QuestionReveal;
        io.to(`game:${gameId}`).emit("player:state", {
          state: PlayerStateValue.Wait,
        });
        break;
      case HostStateValue.QuestionReveal:
        game.state = HostStateValue.Leaderboard;
        const result = game?.players.map((item) => ({
          username: item.username,
          score: item.score,
        }));

        console.log(result);

        socket.emit("game:leaderboard", result);
        break;
      case HostStateValue.Leaderboard:
        if (quiz?.questions.length === game.questionStep) {
          game.state = HostStateValue.AwardCeremony;
        } else {
          game.state = HostStateValue.Question;
          game.questionStep++;
          game.questionStep++;
        }
        break;
      case HostStateValue.AwardCeremony:
        await redisGameStore.delete(gameId);
        break;
    }

    console.log("GAME:CONTINUED:" + gameId + ":" + game.state);

    await redisGameStore.set(gameId, game);

    socket.emit("host:state", {
      state: game.state,
      question: question,
    });
  });
