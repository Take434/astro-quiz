import { useSocketSession } from "#/socket/SocketSessionProvider";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";

export function PlayerAwardCeremony() {
  const socketSession = useSocketSession();
  const playerState = usePlayerState();
  const awardState = playerState.playerAwardState;

  if (!awardState) {
    return <div></div>;
  }

  const leaveGame = () => {
    socketSession.socket.emit("player:rejoin", false);
    playerState.setPlayerState(PlayerStateValue.JoinGame);
  };

  return (
    <div className="h-screen w-screen flex">
      <div className="m-auto flex flex-col">
        <h1 className="bg-primary text-primary-content text-2xl font-bold p-2">
          Danke fürs Spielen!
        </h1>
        <p className="pt-2 px-2">
          Deine Platzierung: {awardState.placement} / {awardState.players}
        </p>
        <p className="px-2">
          Deine Punkte: {awardState.score} / {awardState.maxScore}
        </p>
        <button className="btn btn-primary mt-5 ml-auto" onClick={leaveGame}>
          Quiz verlassen
        </button>
      </div>
    </div>
  );
}
