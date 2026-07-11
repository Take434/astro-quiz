import { Socket } from "socket.io";
import path from "node:path";
import fs from "fs";

export function registerQuizHandlers(socket: Socket) {
  socket.on("quiz:getAll", async () => {
    const filePath = path.join(__dirname, "../", "data", "quiz.json");
    console.log(filePath);

    // let content;

    await fs.readFile(filePath, (err, data) => {
      const jsonObject = JSON.parse(data.toString());

      console.log(jsonObject);

      socket.emit("quiz:getAll", jsonObject);
    });

    // return JSON.parse(content);
  });
}
