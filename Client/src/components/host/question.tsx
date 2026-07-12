import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { useQuestionState } from "#/stores/questionState";

export function HostQuestion() {
  const question = useQuestionState().questionState;
  const socketSession = useSocketSession();

  if (!question) {
    return <>Keine Frage</>;
  }

  const nextQuestion = () => {
    continueGame(socketSession.socket);
  };

  return (
    <div>
      <div>{question?.question}</div>
      <button className="btn btn-primary" onClick={nextQuestion}>
        Weiter
      </button>
    </div>
  );
}
