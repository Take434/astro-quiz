import { Server, Socket } from "socket.io";
import { redisGameStore } from "../redis";
import { getAllQuizzes } from "./quiz-service";
import { Question, QuestionTypeValue } from "../data/quiz";
import {
  Game,
  HostStateValue,
  Player,
  PlayerStateValue,
} from "../types/game.model";

export function registerPlayerHandlers(socket: Socket, io: Server) {
  registerGameJoin(socket, io);
  registerQuestionAnswer(socket, io);
  registerGameRejoin(socket, io);
}

const registerGameJoin = (socket: Socket, io: Server) =>
  socket.on("game:join", async (data: JoinEvent) => {
    const game = await redisGameStore.get(data.gameId);

    if (game) {
      const player: Player = {
        id: socket.request.session.id,
        answerCount: 0,
        score: 0,
        username: data.username,
        icon: data.icon,
      };

      game.players.push(player);

      await redisGameStore.set(data.gameId, {
        ...game,
      });

      socket.join(`game:${data.gameId}`);

      io.to(`game:${data.gameId}`).emit("game:players", game.players);

      socket.request.session.gameId = data.gameId;
      await socket.request.session.save();
      console.log(game);
    }
  });

const registerQuestionAnswer = (socket: Socket, io: Server) =>
  socket.on(
    "question:answer",
    async ({ answerIds, text }: { answerIds: number[]; text: string }) => {
      console.log("GAME:QUESTION:ANSWER");
      const gameId = socket.request.session.gameId;
      if (!gameId) return;
      const game = await redisGameStore.get(gameId);

      if (!game) return;

      const player = game.players.find(
        (item) => item.id === socket.request.session.id,
      );

      if (player && game.questionStep === player.answerCount) {
        console.log("user may answer");
        const quizzes = getAllQuizzes();

        if (game?.quizId) {
          const quiz = quizzes.find((item) => item.id === game.quizId);
          const question = quiz?.questions[game.questionStep];
          player.answerCount++;

          if (question?.type === QuestionTypeValue.MultipleChoice) {
            if (arraysEqualUnordered(question.correctAnswers, answerIds)) {
              console.log("correct");
              player.score++;
            }
          }

          redisGameStore.set(gameId, game);
        }
      }
    },
  );

const registerGameRejoin = (socket: Socket, io: Server) =>
  socket.on("player:rejoin", async (value: boolean) => {
    console.log("PLAYER:REJOIN");
    const gameId = socket.request.session.gameId;
    if (!gameId || !value) {
      socket.request.session.gameId = undefined;
      await socket.request.session.save();
    } else {
      socket.join(`game:${gameId}`);
      const game = await redisGameStore.get(gameId);
      const state = getPlayerState(game!, socket.request.session.id);
      socket.emit("player:state", state);
    }
  });

type JoinEvent = { gameId: number; username: string; icon: string };

function arraysEqualUnordered(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((value, index) => value === sortedB[index]);
}

function getPlayerState(game: Game, userId: string) {
  let playerState: PlayerState | null = null;
  switch (game.state) {
    case HostStateValue.JoinGame:
      playerState = {
        state: PlayerStateValue.Wait,
      };
      break;
    case HostStateValue.Question:
      console.log(game.players.find((item) => item.id === userId)?.answerCount);
      console.log(game.questionStep);
      if (
        game.players.find((item) => item.id === userId)?.answerCount !==
        game.questionStep
      ) {
        playerState = {
          state: PlayerStateValue.Wait,
        };
        break;
      }
      const question = getAllQuizzes().find((item) => item.id === game.quizId)
        ?.questions[game.questionStep];
      playerState = {
        state: PlayerStateValue.Question,
        question: question,
      };
      break;
    default:
      playerState = {
        state: PlayerStateValue.Wait,
      };
  }

  return playerState;
}

export type PlayerState = {
  state: PlayerStateValue;
  question?: Question;
};
