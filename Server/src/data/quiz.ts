export type Quiz = {
  id: number;
  title: string;
  description: string;
  cover: string;
  questions: Question[];
};

export type Question = {
  id: number;
  image?: string;
  type: QuestionTypeValue;
  question: string;
  possibleAnswers: Answer[];
  correctAnswers: number[];
};

type Answer = {
  id: number;
  text: string;
  image?: string;
};

export enum QuestionTypeValue {
  MultipleChoice,
  FreeText,
  HigherLower,
  Order,
}

export const allQuizzes: Quiz[] = [
  {
    id: 1,
    title: "Astronomie SoSe 26",
    description: "Ein Quiz zu den Inhalten des Kurses im Sommer Semester 26",
    cover:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    questions: [
      {
        id: 1,
        type: QuestionTypeValue.MultipleChoice,
        question: "Nenne einen Planeten aus unserem Sonnensystem",
        possibleAnswers: [
          {
            id: 1,
            text: "Erde",
          },
          {
            id: 2,
            text: "Sonne",
          },
          {
            id: 3,
            text: "Mond",
          },
        ],
        correctAnswers: [1, 2, 3],
      },
      {
        id: 1,
        type: QuestionTypeValue.MultipleChoice,
        question:
          "Bringe die Planeten aus unserem Sonnensystem in die richtige Reihenfolge nach Abstand zur Sonne",
        possibleAnswers: [
          {
            id: 1,
            text: "Merkur",
          },
          {
            id: 2,
            text: "Venus",
          },
          {
            id: 3,
            text: "Erde",
          },
          {
            id: 4,
            text: "Mars",
          },
          {
            id: 5,
            text: "Jupiter",
          },
          {
            id: 6,
            text: "Saturn",
          },
          {
            id: 7,
            text: "Uranus",
          },
          {
            id: 8,
            text: "Neptun",
          },
        ],
        correctAnswers: [1, 2, 3, 4, 5, 6, 7, 8],
      },
    ],
  },
  {
    id: 2,
    title: "Astronomie WiSe 26",
    description: "Ein Quiz zu den Inhalten des Kurses im Sommer Semester 26",
    cover:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    questions: [],
  },
];
