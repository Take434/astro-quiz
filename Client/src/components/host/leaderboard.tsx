import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { useHostState } from "#/stores/hostState";
import { CircleStar } from "lucide-react";

export function HostLeaderBoard() {
  const playerScores = useHostState().players;
  const socketSession = useSocketSession();

  const nextQuestion = () => {
    continueGame(socketSession.socket);
  };

  if (!playerScores) {
    return <div>Keine Leaderboard Daten?</div>;
  }

  return (
    <div className="w-screen h-screen flex">
      <div className="m-auto flex flex-col">
        <h1 className="text-4xl font-bold text-primary-content bg-primary p-1">
          Platzierung
        </h1>
        <ul className="list bg-base-300 rounded-box shadow-md overflow-y-auto w-lg max-h-[80vh] mt-5">
          {playerScores
            .sort((a, b) => b.score - a.score)
            .map((x, i) => (
              <li key={i} className="list-row p-2 flex">
                <div className="w-16 text-lg font-bold align-middle flex space-x-2">
                  <div>{i + 1}.</div>
                  <div className="h-full flex items-center justify-center">
                    {i === 0 && <CircleStar color="gold" />}
                    {i === 1 && <CircleStar color="silver" />}
                    {i === 2 && <CircleStar color="brown" />}
                  </div>
                </div>
                <div className="divider divider-horizontal m-0"></div>
                <div className="flex space-x-2 w-60">
                  <p className="text-lg align-middle">{x.icon}</p>
                  <p className="truncate text-lg">{x.username}</p>
                </div>
                <div className="flex ml-auto gap-4">
                  <div className="divider divider-horizontal m-0"></div>
                  <div className="text-lg w-16">
                    {x.score} (+{x.lastScore ?? 0})
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <button
          className="btn btn-primary self-end mt-5"
          onClick={nextQuestion}
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
