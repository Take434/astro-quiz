import { Socket } from "socket.io";
import { redisClient, redisGameStore } from "../redis";
import { Game, GameState, HostStateValue } from "../types/game.model";
import { getAllQuizzes } from "./quiz-service";

export function registerHostHandlers(socket: Socket) {
  registerHostGame(socket);
  registerContinueGame(socket);
}

const registerHostGame = (socket: Socket) =>
  socket.on("game:host", async (quizId: number) => {
    const id = await redisClient.incr("game:id");
    const sessionId = socket.request.session.id;
    await redisGameStore.set<Game>(id, {
      host: sessionId,
      quizId: quizId,
      state: HostStateValue.JoinGame,
      questionStep: 0,
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

const registerContinueGame = (socket: Socket) =>
  socket.on("game:continue", async (_, callback) => {
    const gameId = socket.request.session.gameId;

    if (gameId === undefined) {
      return;
    }

    console.log("gameId:", gameId);
    const game = await redisGameStore.get<Game>(gameId);
    console.log(game);

    if (!game || game.host != socket.request.session.id) {
      return;
    }

    const quiz = (await getAllQuizzes()).find(
      (item) => item.id === game.quizId,
    );

    switch (game.state) {
      case HostStateValue.JoinGame:
        game.state = HostStateValue.Question;
        const question = quiz?.questions[game.questionStep];
        if (question) {
          callback({ success: true, question: question });
        }
        break;
      case HostStateValue.Question:
        game.state = HostStateValue.QuestionReveal;
        break;
      case HostStateValue.QuestionReveal:
        game.state = HostStateValue.Leaderboard;
        break;
      case HostStateValue.Leaderboard:
        if (quiz?.questions.length === game.questionStep) {
          game.state = HostStateValue.AwardCeremony;
        } else {
          game.state = HostStateValue.Question;
          game.questionStep++;
        }
        break;
      case HostStateValue.AwardCeremony:
        await redisGameStore.delete(gameId);
        break;
    }

    console.log("GAME:CONTINUED:" + gameId + ":" + game.state);

    await redisGameStore.set<Game>(gameId, game);
  });
