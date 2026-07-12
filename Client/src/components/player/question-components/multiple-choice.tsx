import type { Question } from "#/stores/questionState";

export function PlayerMultipleCoice({ q }: { q: Question }) {
  return (
    <div className="">
      <h1 className="text-2xl font-bold bg-primary text-primary-content">
        {q.question}
      </h1>
    </div>
  );
}
