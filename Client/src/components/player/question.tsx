import { PlayerMultipleCoice } from "#/components/player/question-components/multiple-choice";
import { QuestionType, useQuestionState } from "#/stores/questionState";

export function PlayerQuestion() {
  const question = useQuestionState().questionState;

  if (!question) {
    return (
      <p>
        Keine aktive Frage, eigentlich sollte das nicht passieren können... Upsi
      </p>
    );
  }

  return (
    <>
      {question.type === QuestionType.MultipleChoice && (
        <PlayerMultipleCoice q={question} />
      )}
    </>
  );
}
