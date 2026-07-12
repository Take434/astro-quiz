import { useQuestionState } from "#/stores/questionState";

export function HostQuestion() {
  const question = useQuestionState().questionState;

  if (!question) {
    return <>Keine Frage</>;
  }

  const nextQuestion = () => {};

  return (
    <div>
      <div>{question?.question}</div>
      <button className="btn btn-primary" onClick={nextQuestion}>
        Weiter
      </button>
    </div>
  );
}
