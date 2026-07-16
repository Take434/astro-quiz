import { joinGame } from "#/services/game-service";
import { registerPlayerStateChange } from "#/socket/registerPlayerHandler";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { usePlayerState } from "#/stores/playerState";
import { useQuestionState } from "#/stores/questionState";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const iconOptions: string[] = [
  "😎",
  "🤑",
  "🐸",
  "👾",
  "🤖",
  "🦊",
  "🐼",
  "🦁",
  "🐯",
  "🦄",
  "👻",
  "💀",
  "🎃",
  "🐙",
  "🦋",
  "🐲",
  "🔥",
  "⚡",
  "🌈",
  "🍕",
  "🎯",
  "🚀",
  "💎",
  "🧠",
  "🎭",
];

export function PlayerJoinGame({ gameId }: { gameId: string }) {
  const [playerIcon, setPlayerIcon] = useState<string>("👽");
  const [userName, setUserName] = useState<string>("");
  const [gameCode, setGameCode] = useState<string>(gameId);
  const socketSession = useSocketSession();
  const updateQuestionState = useQuestionState().setQuestionState;
  const playerState = usePlayerState();

  const startGame = () => {
    registerPlayerStateChange(
      socketSession.socket,
      updateQuestionState,
      playerState.setPlayerState,
      playerState.setPlayerAwardState,
    );
    joinGame(socketSession.socket, gameCode, userName, playerIcon);
  };

  return (
    <div className="p-8 flex h-screen">
      <div className="m-auto">
        <h1 className="text-4xl font-bold text-primary-content bg-primary p-1">
          Einem Spiel Beitreten
        </h1>
        <p className="mt-1">Tritt einem Quiz mit dem Code bei.</p>
        <p>Und such dir einen lustigen Smiley / Namen aus :)</p>
        <div className="mt-5">
          <label className="input w-full">
            <span className="label">Code</span>
            <input
              type="text"
              placeholder=""
              defaultValue={gameId}
              onChange={(x) => setGameCode(x.target.value)}
            />
          </label>
        </div>
        <div className="mt-5 flex">
          <button
            className="btn"
            popoverTarget="player-smiley-dropdown"
            style={
              { anchorName: "--player-smiley-anchor" } as React.CSSProperties
            }
          >
            {playerIcon}
            <ChevronDown />
          </button>

          <ul
            className="dropdown menu w-52 rounded-box bg-base-300 shadow-sm"
            popover="auto"
            id="player-smiley-dropdown"
            style={
              {
                positionAnchor: "--player-smiley-anchor",
              } as React.CSSProperties
            }
          >
            <li>
              <div className="grid grid-cols-5 grid-rows-5 hover:bg-transparent hover:cursor-default">
                {iconOptions.map((x) => (
                  <div
                    key={x}
                    className="hover:bg-base-content hover:cursor-pointer rounded flex"
                    onClick={() => setPlayerIcon(x)}
                  >
                    <p className="mx-auto">{x}</p>
                  </div>
                ))}
              </div>
            </li>
          </ul>
          <input
            className="input"
            type="text"
            placeholder="Hanz Wurst"
            onChange={(x) => setUserName(x.target.value)}
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
  );
}
