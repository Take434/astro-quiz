import { useSocketSession } from "#/socket/SocketSessionProvider";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import type { Question } from "#/stores/questionState";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function PlayerHigherLower({ q }: { q: Question }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const updatePlayerState = usePlayerState().setPlayerState;
  const socketSession = useSocketSession();

  const clickedAnswer = (x: number) => {
    if (answer === x) {
      setAnswer(null);
    } else {
      setAnswer(x);
    }
  };

  const submit = () => {
    if (!answer) {
      return;
    }

    updatePlayerState(PlayerStateValue.Wait);
    socketSession.socket.emit("question:answer", {
      answerIds: [answer],
    });
  };

  return (
    <div className="flex flex-col h-svh">
      <h1 className="text-2xl font-bold bg-primary text-primary-content py-5 px-2">
        {q.question}
      </h1>
      <div className="flex flex-wrap gap-3 mt-10 px-3 overflow-scroll mb-10">
        <div
          className={`border-2 border-neutral-content rounded-2xl h-[25vh] w-full flex flex-col hover:cursor-pointer hover:bg-base-300 ${answer === 1 ? "border-primary text-primary" : ""}`}
          onClick={() => clickedAnswer(1)}
        >
          <ChevronUp className="m-auto h-[80%] w-[80%]" strokeWidth={1} />
        </div>
        <div
          className={`border-2 border-neutral-content rounded-2xl h-[25vh] w-full flex flex-col hover:cursor-pointer hover:bg-base-300 ${answer === -1 ? "border-primary text-primary" : ""}`}
          onClick={() => clickedAnswer(-1)}
        >
          <ChevronDown className="m-auto h-[80%] w-[80%]" strokeWidth={1} />
        </div>
      </div>
      <button className="btn btn-primary mt-auto mb-5 mx-3" onClick={submit}>
        Antworten
      </button>
    </div>
  );
}
