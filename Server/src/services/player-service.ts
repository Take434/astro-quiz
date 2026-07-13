import { Server, Socket } from "socket.io";
import { redisGameStore } from "../redis";
import { getAllQuizzes } from "./quiz-service";
import { Question, QuestionTypeValue } from "../data/quiz";
import {
  Game,
  GameResults,
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

          const score = calculateScore(question!, answerIds, text);
          console.log("score", score);

          player.score += score;

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

function calculateScore(question: Question, answerIds: number[], text: string) {
  let score: number;
  switch (question.type) {
    case QuestionTypeValue.MultipleChoice:
      // +1 score for correct entry
      // -1 score for wrong entry
      score = 0;
      answerIds.forEach((id) => {
        if (question.correctAnswers.includes(id)) {
          score++;
        } else {
          score--;
        }
      });
      return score >= 0 ? score : 0;
    case QuestionTypeValue.HigherLower:
      // +1 score if correct answer
      if (question.correctAnswers[0] === answerIds[0]) {
        return 1;
      }
      return 0;
    case QuestionTypeValue.Order:
      // +1 score for each entry at correct position
      score = 0;
      question.correctAnswers.forEach((id, index) => {
        if (id === answerIds[index]) {
          score++;
        }
      });
      return score;
    case QuestionTypeValue.FreeText:
      // TODO
      return 0;
    default:
      return 0;
  }
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
    case HostStateValue.AwardCeremony:
      const quiz = getAllQuizzes().find((item) => item.id === game.quizId);

      const activePlayerIndex = game.players.findIndex((x) => x.id === userId);

      game.players.sort((a, b) => b.score - a.score);

      const gameResults: GameResults = {
        maxScore: quiz?.maxScore ?? 0,
        players: game.players.length,
        placement: activePlayerIndex + 1,
        score: game.players.at(activePlayerIndex)?.score ?? 0,
      };

      playerState = {
        state: PlayerStateValue.AwardCeremony,
        gameResults: gameResults,
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
  gameResults?: GameResults;
};
