import { Socket } from "socket.io";
import { allQuizzes, Quiz } from "../data/quiz";

export function registerQuizHandlers(socket: Socket) {
  socket.on("quiz:getAll", async (data, callback) => {
    const quizzes = getAllQuizzes();
    callback({
      success: true,
      quizzes: quizzes,
    });
  });
}

export const getAllQuizzes = (): Quiz[] => allQuizzes;
