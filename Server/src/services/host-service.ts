import { Server, Socket } from "socket.io";
import { redisClient, redisGameStore } from "../redis";
import {
  GameState,
  HostStateValue,
  Player,
  PlayerStateValue,
} from "../types/game.model";
import { getAllQuizzes } from "./quiz-service";
import { Answer, Question } from "../data/quiz";
import { GameResults } from "../types/game.model";
import { sessionSockets } from "..";

export function registerHostHandlers(socket: Socket, io: Server) {
  registerHostGame(socket);
  registerContinueGame(socket, io);
  registerGameRejoin(socket, io);
}

const registerHostGame = (socket: Socket) =>
  socket.on("game:host", async (quizId: number) => {
    const gameId = await redisClient.incr("game:id");
    const sessionId = socket.request.session.id;
    await redisGameStore.set(gameId, {
      host: sessionId,
      quizId: quizId,
      state: HostStateValue.JoinGame,
      questionStep: 0,
      players: [],
    });
    socket.join(`game:${gameId}`);

    console.log("GAME:HOSTED:" + gameId);

    socket.emit("host:state", {
      gameId: gameId,
      players: [],
      state: HostStateValue.JoinGame,
    } satisfies HostState);

    socket.request.session.gameId = gameId;
    await socket.request.session.save();
  });

const registerContinueGame = (socket: Socket, io: Server) =>
  socket.on("game:continue", async () => {
    const gameId = socket.request.session.gameId;

    if (gameId === undefined) {
      return;
    }

    const game = await redisGameStore.get(gameId);

    if (!game || game.host != socket.request.session.id) {
      return;
    }

    const quiz = (await getAllQuizzes()).find(
      (item) => item.id === game.quizId,
    );

    let question: Question | undefined = undefined;

    switch (game.state) {
      case HostStateValue.JoinGame:
        game.state = HostStateValue.Question;
        game.timer = Date.now() + 60_000;
        question = quiz?.questions[game.questionStep];
        if (question?.possibleAnswers) {
          question.possibleAnswers = shuffle(question.possibleAnswers);
        }
        if (question) {
          io.to(`game:${gameId}`).emit("player:state", {
            state: PlayerStateValue.Question,
            question: { ...question, correctAnswers: [] } satisfies Question,
          });
        }
        break;
      case HostStateValue.Question:
        game.state = HostStateValue.QuestionReveal;
        game.timer = undefined;
        question = quiz?.questions[game.questionStep];
        game.players.forEach((player) => {
          const socketId = sessionSockets.get(player.id);
          io.to(socketId).emit("player:state", {
            state: PlayerStateValue.QuestionReveal,
            question: question,
            players: [player],
          });
        });
        break;
      case HostStateValue.QuestionReveal:
        game.state = HostStateValue.Leaderboard;
        io.to("game:" + gameId).emit("player:state", {
          state: PlayerStateValue.Wait,
        });
        break;
      case HostStateValue.Leaderboard:
        game.questionStep++;
        game.players = game.players.map((item) => ({
          ...item,
          answerCount: game.questionStep,
          lastScore: 0,
          lastAnswerIds: [],
          lastText: undefined,
        }));
        if (quiz?.questions.length === game.questionStep) {
          game.state = HostStateValue.AwardCeremony;

          game.players.sort((a, b) => b.score - a.score);

          game.players.forEach((player, index) => {
            const gameResults: GameResults = {
              maxScore: quiz.maxScore,
              players: game.players.length,
              placement: index + 1,
              score: player.score ?? 0,
            };

            const socketId = sessionSockets.get(player.id);
            io.to(socketId).emit("player:state", {
              gameResults: gameResults,
              state: PlayerStateValue.AwardCeremony,
            });
          });
        } else {
          game.state = HostStateValue.Question;
          game.timer = Date.now() + 60_000;
          question = quiz?.questions[game.questionStep];

          if (question?.possibleAnswers) {
            question.possibleAnswers = shuffle(question.possibleAnswers);
          }

          if (question) {
            io.to(`game:${gameId}`).emit("player:state", {
              state: PlayerStateValue.Question,
              question: { ...question, correctAnswers: [] } satisfies Question,
            });

            game.players.forEach((player, index) => {
              const socketId = sessionSockets.get(player.id);
              io.to(socketId).emit("game:players", [player] satisfies Player[]);
            });
          }
        }
        break;
      case HostStateValue.AwardCeremony:
        await redisGameStore.delete(gameId);
        console.log("GAME:DELETED:" + gameId);
        io.to(`game:${gameId}`).emit("game:ended");
        return;
    }

    console.log("GAME:CONTINUED:" + gameId + ":" + game.state);

    await redisGameStore.set(gameId, game);

    socket.emit("host:state", {
      state: game.state,
      question: question,
      questionNr: game.questionStep,
      players: game.players,
    });
  });

const registerGameRejoin = (socket: Socket, io: Server) =>
  socket.on("host:rejoin", async (value: boolean) => {
    console.log("HOST:REJOIN");
    const gameId = socket.request.session.gameId;
    if (!gameId || !value) {
      socket.request.session.gameId = undefined;
      await redisGameStore.delete(gameId!);
      console.log("GAME:DELETED:" + gameId);
      io.to(`game:${gameId}`).emit("error", "Der Host hat das Spiel beendet");
      io.to(`game:${gameId}`).emit("game:ended");
      await socket.request.session.save();
    } else {
      socket.join(`game:${gameId}`);
      const game = await redisGameStore.get(gameId);
      if (!game) return;
      const question = getAllQuizzes().find((item) => item.id === game.quizId)
        ?.questions[game.questionStep];

      const timer = game.timer
        ? Math.floor((game.timer - Date.now()) / 1000)
        : undefined;

      const state: HostState = {
        gameId: gameId,
        state: game.state,
        question: question,
        players: game.players.sort((a, b) => a.score - b.score),
        timer: timer,
      };
      socket.emit("host:state", state);
    }
  });

export type HostState = {
  gameId: number;
  state: HostStateValue;
  question?: Question;
  players: Player[];
  timer?: number;
};

function shuffle(array: Answer[]): Answer[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
