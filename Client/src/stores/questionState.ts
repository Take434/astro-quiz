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
  question:
    "Welche Planten in unserem Sonnensytem bestehen vollständig aus Gas?",
  type: QuestionType.HigherLower,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/M101_hires_STScI-PRC2006-10a.jpg/1280px-M101_hires_STScI-PRC2006-10a.jpg",
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
  ],
  correctAnswers: [4],
};

export const useQuestionState = create<QuestionState>((set) => ({
  questionState: example,
  setQuestionState: (state: Question) => set({ questionState: state }),
}));
