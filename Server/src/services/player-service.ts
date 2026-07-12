import { Server, Socket } from "socket.io";
import { redisGameStore } from "../redis";
import { getAllQuizzes } from "./quiz-service";
import { QuestionTypeValue } from "../data/quiz";
import { Player } from "../types/game.model";

export function registerPlayerHandlers(socket: Socket, io: Server) {
  registerGameJoin(socket, io);
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
      };

      game.players.push(player);

      await redisGameStore.set(data.gameId, {
        ...game,
      });

      socket.join(`game:${data.gameId}`);

      io.to(`game:${data.gameId}`).emit("player:joined", {
        player: data.username,
      });

      socket.request.session.gameId = data.gameId;
      await socket.request.session.save();
      console.log(game);
    }
  });

const registerQuestionAnswer = (socket: Socket, io: Server) =>
  socket.on(
    "question:answer",
    async ({ answerIds, text }: { answerIds: number[]; text: string }) => {
      const gameId = socket.request.session.gameId;
      if (!gameId) return;
      const game = await redisGameStore.get(gameId);

      if (!game) return;

      const player = game.players.find(
        (item) => item.id === socket.request.session.id,
      );

      if (player && game.questionStep > player.answerCount) {
        console.log("user may answer");
        const quizzes = getAllQuizzes();

        if (game?.quizId) {
          const quiz = quizzes.find((item) => item.id === game.quizId);
          const question = quiz?.questions[game.questionStep];

          if (question?.type === QuestionTypeValue.Multiple) {
            if (arraysEqualUnordered(question.correctAnswers, answerIds)) {
              console.log("correct");
            }
          }
        }
      }
    },
  );
type JoinEvent = { gameId: number; username: string };

function arraysEqualUnordered(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((value, index) => value === sortedB[index]);
}
