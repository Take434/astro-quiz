import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";

export const useQuizzes = (socket: Socket): Quiz[] => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  useEffect(() => {
    socket.emit("quiz:getAll", {}, (response: QuizResponse) => {
      if (response.success) {
        setQuizzes(response.quizzes);
      }
    });
  }, []);

  return quizzes;
};

export type Quiz = {
  id: number;
  title: string;
  description: string;
  cover: string;
};

type BaseResponse = {
  success: boolean;
};

type QuizResponse = BaseResponse & {
  quizzes: Quiz[];
};
