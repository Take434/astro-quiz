import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { useHostState } from "#/stores/hostState";
import { CircleStar } from "lucide-react";

export function HostAwardCeremony() {
  const playerScores = useHostState().players;
  const socketSession = useSocketSession();

  playerScores?.sort((a, b) => b.score - a.score);

  const nextQuestion = () => {
    continueGame(socketSession.socket);
  };
  return (
    <div className="w-screen h-screen flex pt-20">
      <div className="mx-auto flex flex-col">
        <h1 className="text-4xl bg-primary text-primary-content mb-10">
          Danke fürs Spielen!
        </h1>
        <div className="flex">
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
          <ul className="list bg-base-300 rounded-box shadow-md w-lg h-fit max-h-100 overflow-y-auto mt-5">
            {playerScores
              ?.sort((a, b) => b.score - a.score)
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
        </div>

        <button className="btn btn-primary mt-20 mx-60" onClick={nextQuestion}>
          Quiz beenden
        </button>
      </div>
    </div>
  );
}
