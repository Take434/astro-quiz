import { PlayerFreeText } from "#/components/player/question-components/free-text";
import { PlayerHigherLower } from "#/components/player/question-components/higher-lower";
import { PlayerMultipleCoice } from "#/components/player/question-components/multiple-choice";
import { PlayerOrder } from "#/components/player/question-components/order";
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
      {question.type === QuestionType.Order && <PlayerOrder q={question} />}
      {question.type === QuestionType.HigherLower && (
        <PlayerHigherLower q={question} />
      )}
      {question.type === QuestionType.FreeText && (
        <PlayerFreeText q={question} />
      )}
    </>
  );
}
