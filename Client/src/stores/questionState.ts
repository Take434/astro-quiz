import { create } from "zustand";

export enum QuestionType {
  MultipleChoice,
  FreeText,
  HigherLower,
  Order,
}

export type Answer = {
  id: number;
  text: string;
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
      id: 1,
      text: "Nah mate never, dont even worry about it",
    },
    {
      id: 2,
      text: "Well, aint that what they are there for?",
    },
    {
      id: 3,
      text: "Nope, blowing it up tho...",
    },
    {
      id: 4,
      text: "I know for a fact 9/11 was an inside job",
    },
  ],
  correctAnswers: [4],
};

export const useQuestionState = create<QuestionState>((set) => ({
  questionState: example,
  setQuestionState: (state: Question) => set({ questionState: state }),
}));
