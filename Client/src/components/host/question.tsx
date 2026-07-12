import { continueGame } from "#/services/game-service";
import { useSocketSession } from "#/socket/SocketSessionProvider";
import { QuestionType, useQuestionState } from "#/stores/questionState";
import { useEffect, useState } from "react";

function typeToBadge(t: QuestionType) {
  switch (t) {
    case QuestionType.MultipleChoice:
      return "Multipe Choice";
    case QuestionType.FreeText:
      return "Freitext";
    case QuestionType.HigherLower:
      return "Mehr oder Weniger";
    case QuestionType.Order:
      return "Sortieren";
  }
}

function typeToExplainer(t: QuestionType) {
  switch (t) {
    case QuestionType.MultipleChoice:
      return "Wähle aus den Antwortmöglichkeiten aus. Es können auch mehrere Antworten richtig sein";
    case QuestionType.FreeText:
      return "Beantworte die Frage selber, achte auch auf die Rechtschreibung";
    case QuestionType.HigherLower:
      return "Schätze ab ob eine Größe mehr oder weniger ist";
    case QuestionType.Order:
      return "Bringe die Antworten in die richtige Reihenfolge";
  }
}

export function HostQuestion() {
  const question = useQuestionState().questionState;
  const socketSession = useSocketSession();
  const [countdown, setCountdown] = useState<number>(60);

  useEffect(() => {
    setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
  });

  if (!question) {
    return <>Keine Frage</>;
  }

  const nextQuestion = () => {
    continueGame(socketSession.socket);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <span className="countdown font-mono text-9xl mx-auto mt-5">
        <span
          style={{ "--value": countdown, "--digits": 2 } as React.CSSProperties}
          aria-live="polite"
          aria-label="counter"
        >
          countdown
        </span>
      </span>
      <div className="m-auto mt-5 flex flex-col max-w-[30vw]">
        <span className="badge bg-accent text-accent-content text-lg rounded-none">
          {typeToBadge(question.type)}
        </span>
        <h1 className="bg-primary text-primary-content text-4xl font-bold p-2">
          {question?.question}
        </h1>
        <div>{typeToExplainer(question.type)}</div>
        <div className="bg-base-300 mt-5 p-5">
          <img src={question.image} className=" w-lg mx-auto" />
        </div>
        <button className="btn btn-primary ml-auto mt-5" onClick={nextQuestion}>
          Weiter
        </button>
      </div>
    </div>
  );
}
