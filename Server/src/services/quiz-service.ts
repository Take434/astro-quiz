import { Socket } from "socket.io";
import path from "node:path";
import fs from "fs";
import { Game, HostStateValue } from "../types/game.model";
import { redisGameStore } from "../redis";
import { allQuizzes, Quiz } from "../data/quiz";

export function registerQuizHandlers(socket: Socket) {
  socket.on("quiz:getAll", async (data, callback) => {
    console.log("hii");
    const quizzes = getAllQuizzes();

    console.log(quizzes);

    callback({
      success: true,
      quizzes: quizzes,
    });
  });
}

export const getAllQuizzes = (): Quiz[] => {
  const quizzes = allQuizzes;
  return quizzes;
};
