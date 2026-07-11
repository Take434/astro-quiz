import express, { type Express, type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app: Express = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

console.log("webserver started");

// app.listen(3000);
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
