import { HostStateValue, useHostState } from "#/stores/hostState";
import { useState } from "react";

type quiz = {
  id: string;
  title: string;
  description: string;
  cover: string;
};

export function HostCreateGame() {
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const updateHostState = useHostState().setHostState;
  const quizzs: quiz[] = [
    {
      id: "abc123",
      title: "Astronomie SoSe 26",
      description: "Ein Quiz zu den Inhalten des Kurses im Sommer Semester 26",
      cover:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    },
  ];

  const startGame = () => {
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
        <p>Vergib einen Namen und such das Quiz aus</p>
        <div className="mt-5">
          <label className="input w-full">
            <span className="label">Name</span>
            <input type="text" placeholder="" />
          </label>
        </div>
        <div className="flex gap-5 mt-5 w-full flex-col">
          {quizzs.map((x) => (
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
  q: quiz;
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
