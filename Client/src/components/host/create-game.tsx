import { hostGame } from "#/services/game-service";
import { useQuizzes, type Quiz } from "#/services/quiz-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { HostStateValue, useHostState } from "#/stores/hostState";
import { useEffect, useState } from "react";

export function HostCreateGame() {
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const updateHostState = useHostState().setHostState;
  const socketSession = useSocketSession();

  const quizzes = useQuizzes(socketSession.socket);

  const startGame = () => {
    hostGame(socketSession.socket);
    updateHostState(HostStateValue.JoinGame);
  };

  return (
    <div className="p-8 flex h-screen">
      <div className="m-auto">
        <h1 className="text-4xl font-bold text-primary-content bg-primary p-1">
          Erstell ein Spiel
        </h1>
        <p className="mt-1">
          Erstell eine Spiel dem andere Spieler beitreten können.
        </p>
        <p>Such dir eins der Quizzes von unten aus und leg los.</p>
        <div className="flex gap-5 mt-10 w-full flex-col">
          {quizzes?.map((x) => (
            <QuizPreview
              q={x}
              selected={x.id === selectedQuiz}
              setSelected={setSelectedQuiz}
            />
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="btn bg-primary text-primary-content"
            onClick={startGame}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizPreview({
  q,
  selected,
  setSelected,
}: {
  q: Quiz;
  selected: boolean;
  setSelected: (a: string) => void;
}) {
  return (
    <div
      key={q.id}
      className={`card bg-base-100 w-96 shadow-sm ${selected ? "border-5 border-primary" : "p-1"}`}
      onClick={() => setSelected(q.id)}
    >
      <figure>
        <img src={q.cover} />
      </figure>
      <div className="card-body bg-base-300">
        <h2 className="card-title">{q.title}</h2>
        <p>{q.description}</p>
      </div>
    </div>
  );
}
