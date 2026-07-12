import { useSocketSession } from "#/socket/SocketSessionProvider";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import type { Question } from "#/stores/questionState";
import { useState } from "react";

export function PlayerFreeText({ q }: { q: Question }) {
  const [answer, setAnswer] = useState<string>("");
  const updatePlayerState = usePlayerState().setPlayerState;
  const socketSession = useSocketSession();

  const submit = () => {
    if (answer.length === 0) {
      return;
    }

    updatePlayerState(PlayerStateValue.Wait);
    socketSession.socket.emit("question:answer", {
      text: answer,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-bold bg-primary text-primary-content py-5 px-2">
        {q.question}
      </h1>
      <div className="flex flex-wrap gap-3 mt-10 px-3 overflow-scroll mb-10">
        <input
          className="input w-full"
          type="text"
          placeholder="Antwort..."
          onChange={(x) => setAnswer(x.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-auto mb-10 mx-3" onClick={submit}>
        Antworten
      </button>
    </div>
  );
}
