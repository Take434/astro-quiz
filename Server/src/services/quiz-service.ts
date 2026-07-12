import { Socket } from "socket.io";
import path from "node:path";
import fs from "fs";

export function registerQuizHandlers(socket: Socket) {
  socket.on("quiz:getAll", async (data, callback) => {
    const filePath = path.join(__dirname, "../", "data", "quiz.json");

    // let content;

    await fs.readFile(filePath, (err, json) => {
      const jsonObject = JSON.parse(json.toString());

      callback({
        success: true,
        quizzes: jsonObject,
      });
    });

    // return JSON.parse(content);
  });
}
