import { useSocketSession } from "#/socket/SocketSessionProvider";
import { PlayerStateValue, usePlayerState } from "#/stores/playerState";
import type { Question } from "#/stores/questionState";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

export function PlayerOrder({ q }: { q: Question }) {
  const [answers, setAnswers] = useState(q.possibleAnswers);
  const updatePlayerState = usePlayerState().setPlayerState;
  const socketSession = useSocketSession();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setAnswers((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // must move 8px before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const submit = () => {
    updatePlayerState(PlayerStateValue.Wait);
    socketSession.socket.emit("question:answer", {
      answerIds: answers.map((x) => x.id),
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <h1 className="text-2xl font-bold bg-primary text-primary-content py-5 px-2">
        {q.question}
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={answers.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3 mt-10 px-3 mb-10 overflow-y-auto overflow-x-hidden flex-1">
            {answers.map((answer) => (
              <SortableAnswer key={answer.id} answer={answer} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button className="btn btn-primary mb-10 mx-3" onClick={submit}>
        Antworten
      </button>
    </div>
  );
}

function SortableAnswer({
  answer,
}: {
  answer: Question["possibleAnswers"][number];
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: answer.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        border-2 rounded border-base-content p-2  
        bg-base-100
        cursor-grab active:cursor-grabbing
        touch-none
      "
    >
      {answer.text && <div>{answer.text}</div>}

      {answer.image && (
        <img
          draggable={false}
          src={answer.image}
          className="w-44 h-44 object-cover select-none"
        />
      )}
    </div>
  );
}
