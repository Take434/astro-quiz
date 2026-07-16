import { typeToBadge } from "#/components/host/question";
import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { QuestionType, useQuestionState } from "#/stores/questionState";

export function HostQuestionReveal() {
  const socketSession = useSocketSession();
  const question = useQuestionState().questionState;

  const nextQuestion = () => {
    continueGame(socketSession.socket);
  };

  if (!question) {
    return <>Keine Frage</>;
  }

  const visibleAnswers =
    question.type === QuestionType.Order
      ? [...question.possibleAnswers].sort((a, b) => a.id - b.id)
      : question.possibleAnswers;

  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <div className="m-auto mt-5 flex flex-col max-w-[30vw]">
          <span className="badge bg-accent text-accent-content text-lg rounded-none">
            {typeToBadge(question.type)}
          </span>
          <h1 className="bg-primary text-primary-content text-4xl font-bold p-2">
            {question?.question}
          </h1>
          <div className="flex flex-wrap gap-3 mt-10 px-3 overflow-y-auto mb-10 max-h-[70vh]">
            {visibleAnswers.map((a) => (
              <div key={a.id} className={`${a.text ? "w-full" : ""}`}>
                {a.text && (
                  <div
                    className={`p-2 border-2 rounded h-fit ${question.correctAnswers?.includes(a.id) ? "border-accent" : "border-base-content"}`}
                  >
                    {a.text}
                  </div>
                )}
                {a.image && (
                  <div
                    className={`p-2 border-2 rounded h-fit ${question.correctAnswers?.includes(a.id) ? "border-accent" : ""}`}
                  >
                    <img className="w-44 h-44" src={a.image} />
                  </div>
                )}
              </div>
            ))}
            {visibleAnswers.length === 0 && (
              <div>
                Die Antwort ist:{" "}
                <span className="bg-secondary text-secondary-content">
                  {question.correctAnswers
                    ? question.correctAnswers[0] === -1
                      ? "Weniger"
                      : "Mehr"
                    : "n/a"}
                </span>
              </div>
            )}
          </div>
          <button
            className="btn btn-primary ml-auto mt-5"
            onClick={nextQuestion}
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
