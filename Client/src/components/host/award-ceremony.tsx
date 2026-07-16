import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { useHostState } from "#/stores/hostState";

export function HostAwardCeremony() {
  const playerScores = useHostState().players;
  const socketSession = useSocketSession();

  playerScores?.sort((a, b) => b.score - a.score);

  const nextQuestion = () => {
    continueGame(socketSession.socket);
  };
  return (
    <div className="w-screen h-screen flex">
      <div className="m-auto flex flex-col">
        <h1 className="text-4xl bg-primary text-primary-content">
          Danke fürs Spielen!
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="400"
          height="400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width=".5"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-podium-icon lucide-podium"
        >
          <text x="3" y="12" style={{ fontSize: 4 }}>
            {playerScores?.at(1)?.icon || "❔"}
          </text>
          <text x="9.3" y="8" style={{ fontSize: 4 }}>
            {playerScores?.at(0)?.icon || "❔"}
          </text>
          <text x="15.5" y="14" style={{ fontSize: 4 }}>
            {playerScores?.at(2)?.icon || "❔"}
          </text>
          <path d="M9 15a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1" />
          <path d="M9 21V11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10" />
        </svg>
        <button className="btn btn-primary" onClick={nextQuestion}>
          Quiz beenden
        </button>
      </div>
    </div>
  );
}
