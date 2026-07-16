import { typeToBadge } from "#/components/host/question";
import { useHostState, type Player } from "#/stores/hostState";
import { QuestionType, useQuestionState } from "#/stores/questionState";
import { useEffect, useState } from "react";

export function PlayerQuestionReveal() {
  const question = useQuestionState().questionState;

  const { players } = useHostState();

  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => setPlayer(players?.[0] ?? null), [players]);

  if (!question) {
    return <>Keine Frage</>;
  }

  const visibleAnswers =
    question.type === QuestionType.Order
      ? [...question.possibleAnswers].sort((a, b) => a.id - b.id)
      : question.possibleAnswers;

  const checkCorrect = (id: number, index: number, arr?: number[]) => {
    if (question.type === QuestionType.Order) {
      return arr?.[index] === id;
    }
    return arr?.includes(id);
  };

  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <div className="m-auto mt-5 flex flex-col">
          <span className="badge bg-accent text-accent-content text-lg rounded-none">
            {typeToBadge(question.type)}
          </span>
          <h1 className="bg-primary text-primary-content text-4xl font-bold p-2">
            {question?.question}
          </h1>
          <div className="flex flex-wrap gap-3 mt-10 px-3 overflow-y-auto mb-10">
            {visibleAnswers.map((a, i) => (
              <div key={a.id} className={`${"w-full"}`}>
                {a.text && (
                  <div
                    className={`p-2 border-2 rounded h-fit ${checkCorrect(a.id, i, question.correctAnswers) ? (checkCorrect(a.id, i, player?.lastAnswerIds) ? "border-accent" : "border-base-content") : checkCorrect(a.id, i, player?.lastAnswerIds) ? "border-red-600" : "border-base-content"}`}
                  >
                    {question.type === QuestionType.FreeText
                      ? (player?.lastText ?? "<Keine Antwort>")
                      : a.text}
                  </div>
                )}
                {a.image && (
                  <div
                    className={`p-2 border-2 rounded h-fit ${checkCorrect(a.id, i, question.correctAnswers) ? "border-secondary" : ""}`}
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
        </div>
      </div>
    </div>
  );
}
