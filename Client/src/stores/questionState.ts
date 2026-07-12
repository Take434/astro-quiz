import { create } from "zustand";

export enum QuestionType {
  MultipleChoice,
  FreeText,
  HigherLower,
  Order,
}

export type Answer = {
  id: number;
  text?: string;
  image?: string;
};

export type Question = {
  id: number;
  question: string;
  type: QuestionType;
  image?: string;
  possibleAnswers: Answer[];
  correctAnswers: number[];
};

export interface QuestionState {
  questionState: Question | null;
  setQuestionState: (state: Question) => void;
}

const example: Question = {
  id: 67,
  question: "Would you steal a car?",
  type: QuestionType.MultipleChoice,
  possibleAnswers: [
    {
      id: 11,
      text: "Nah mate never, dont even worry about it",
    },
    {
      id: 12,
      text: "Well, aint that what they are there for?",
    },
    {
      id: 13,
      text: "Nope, blowing it up tho...",
    },
    {
      id: 14,
      text: "I know for a fact 9/11 was an inside job",
    },
    {
      id: 1,
      image:
        "https://media.tenor.com/oBso-DbE4ZYAAAAM/bernd-das-brot-deutsch.gif",
    },
    {
      id: 2,
      image:
        "https://media.tenor.com/M1scMNKh6nQAAAAM/nutricscore-nutri-score.gif",
    },
    {
      id: 3,
      image: "https://media.tenor.com/8in0iRRvNRoAAAAm/semel-kater.webp",
    },
    {
      id: 4,
      image:
        "https://media.tenor.com/77ICN595wI0AAAAM/dinner-for-one-bernd-das-brot.gif",
    },
  ],
  correctAnswers: [4],
};

export const useQuestionState = create<QuestionState>((set) => ({
  questionState: example,
  setQuestionState: (state: Question) => set({ questionState: state }),
}));
