import { Server, Socket } from "socket.io";
import { redisClient, redisGameStore } from "../redis";
import {
  GameState,
  HostStateValue,
  Player,
  PlayerStateValue,
} from "../types/game.model";
import { getAllQuizzes } from "./quiz-service";
import { Question } from "../data/quiz";
import { GameResults } from "../types/game.model";
import { sessionSockets } from "..";

export function registerHostHandlers(socket: Socket, io: Server) {
  registerHostGame(socket);
  registerContinueGame(socket, io);
  registerGameRejoin(socket, io);
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

    const game = await redisGameStore.get(gameId);

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
        game.timer = Date.now() + 60_000;
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
        game.timer = undefined;
        io.to(`game:${gameId}`).emit("player:state", {
          state: PlayerStateValue.Wait,
        });
        break;
      case HostStateValue.QuestionReveal:
        game.state = HostStateValue.Leaderboard;
        break;
      case HostStateValue.Leaderboard:
        game.questionStep++;
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
        state: game.state,
        question: question,
        players: game.players.sort((a, b) => a.score - b.score),
        timer: timer,
      };
      socket.emit("host:state", state);
    }
  });

export type HostState = {
  state: HostStateValue;
  question?: Question;
  players: Player[];
  timer?: number;
};
