import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";

export function HostAwardCeremony() {
  const socketSession = useSocketSession();

  const nextQuestion = () => {
    continueGame(socketSession.socket);
  };
  return (
    <div>
      Award Ceremony
      <button className="btn btn-primary" onClick={nextQuestion}>
        Weiter
      </button>
    </div>
  );
}
