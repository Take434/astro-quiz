export type Quiz = {
  id: number;
  title: string;
  description: string;
  cover: string;
  questions: Question[];
};

type Question = {
  id: number;
  image?: string;
  type: QuestionTypeValue;
  text: string;
  options: Option[];
  answers: number[];
};

type Option = {
  id: number;
  text: string;
  image?: string;
};

enum QuestionTypeValue {
  Multiple,
  Order,
  Text,
  HigherLower,
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
        type: QuestionTypeValue.Text,
        text: "Nenne einen Planeten aus unserem Sonnensystem",
        options: [
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
        answers: [1, 2, 3],
      },
      {
        id: 1,
        type: QuestionTypeValue.Text,
        text: "Bringe die Planeten aus unserem Sonnensystem in die richtige Reihenfolge nach Abstand zur Sonne",
        options: [
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
        answers: [1, 2, 3, 4, 5, 6, 7, 8],
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
