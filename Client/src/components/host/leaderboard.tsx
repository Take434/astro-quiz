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
          Score
        </h1>
        <ul className="list bg-base-300 rounded-box shadow-md w-lg max-h-[80vh] mt-5 overflow-scroll">
          {playerScores
            .sort((a, b) => b.score - a.score)
            .map((x, i) => (
              <li className="list-row p-2">
                <div className="w-7 text-lg font-bold text-right align-middle">
                  {x.score}
                </div>
                <div className="divider divider-horizontal"></div>
                {i === 0 && <CircleStar color="gold" />}
                {i === 1 && <CircleStar color="silver" />}
                {i === 2 && <CircleStar color="brown" />}
                <p className="truncate w-full text-lg align-middle">{x.icon}</p>
                <p className="truncate w-full text-lg align-middle">
                  {x.username}
                </p>
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
