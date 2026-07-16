import { useSocketSession } from "#/socket/SocketSessionProvider";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import type { Question } from "#/stores/questionState";
import { useState } from "react";

export function PlayerMultipleCoice({ q }: { q: Question }) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const updatePlayerState = usePlayerState().setPlayerState;
  const socketSession = useSocketSession();

  const clickedAnswer = (id: number) => {
    const index = selectedAnswers.findIndex((x) => x === id);
    if (index >= 0) {
      const copy = [...selectedAnswers];
      copy.splice(index, 1);
      setSelectedAnswers(copy);
    } else {
      setSelectedAnswers([...selectedAnswers, id]);
    }
  };

  const submit = () => {
    if (selectedAnswers.length === 0) {
      return;
    }

    updatePlayerState(PlayerStateValue.Wait);
    socketSession.socket.emit("question:answer", {
      answerIds: selectedAnswers,
    });
  };

  return (
    <div className="flex flex-col h-svh">
      <h1 className="text-2xl font-bold bg-primary text-primary-content py-5 px-2">
        {q.question}
      </h1>
      <div className="flex flex-wrap gap-3 mt-10 px-3 overflow-scroll mb-10">
        {q.possibleAnswers.map((a) => (
          <div key={a.id} className={`${a.text ? "w-full" : ""}`}>
            {a.text && (
              <div
                className={`p-2 border-2 rounded h-fit ${selectedAnswers.includes(a.id) ? "border-secondary" : "border-base-content"}`}
                onClick={() => clickedAnswer(a.id)}
              >
                {a.text}
              </div>
            )}
            {a.image && (
              <div
                className={`p-2 border-2 rounded h-fit ${selectedAnswers.includes(a.id) ? "border-secondary" : ""}`}
                onClick={() => clickedAnswer(a.id)}
              >
                <img className="w-44 h-44" src={a.image} />
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-auto mb-5 mx-3" onClick={submit}>
        Antworten
      </button>
    </div>
  );
}
