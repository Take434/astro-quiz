import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { useHostState } from "#/stores/hostState";
import QRCode from "react-qr-code";

export function HostJoinGame() {
  const socketSession = useSocketSession();

  const players = useHostState().players;

  const startGame = () => {
    continueGame(socketSession.socket);
  };

  return (
    <div className="p-8 flex h-screen">
      <div className="m-auto flex gap-5">
        <ul className="list bg-base-300 rounded-box shadow-md w-75">
          {players.map((x) => (
            <li className="list-row p-2">
              <div>{x.icon}</div>
              <p className="truncate w-full">{x.username}</p>
            </li>
          ))}
        </ul>
        <div>
          <h1 className="text-4xl font-bold text-primary-content bg-primary p-1">
            Auf Spieler Warten
          </h1>
          <div className="bg-white p-2 mt-5">
            <QRCode
              value={`${socketSession.game?.id ?? "NOTHING HERE MATE"}`}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
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
    </div>
  );
}
