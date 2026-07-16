export type Quiz = {
  id: number;
  title: string;
  description: string;
  cover: string;
  questions: Question[];
  maxScore: number;
};

const baseImageUrl = "/questions/";

export type Question = {
  id: number;
  image?: string;
  revealImage?: string;
  type: QuestionTypeValue;
  question: string;
  possibleAnswers: Answer[];
  correctAnswers: number[];
};

export type Answer = {
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

function calcQuestionMaxScore(question: Question): number {
  switch (question.type) {
    case QuestionTypeValue.MultipleChoice:
      return question.correctAnswers.length;
    case QuestionTypeValue.FreeText:
      return 2;
    case QuestionTypeValue.HigherLower:
      return 1;
    case QuestionTypeValue.Order:
      return question.correctAnswers.length;
    default:
      return 0;
  }
}

export function calcMaxScore(quiz: Omit<Quiz, "maxScore">): number {
  return quiz.questions.reduce((sum, q) => sum + calcQuestionMaxScore(q), 0);
}

// wie cool ist typescript bitte, hallo??
const rawQuizzes: Omit<Quiz, "maxScore">[] = [
  {
    id: 1,
    title: "Astronomie SoSe 26",
    description: "Ein Quiz zu den Inhalten des Kurses im Sommer Semester 26",
    cover: "/quiz-one.jpg",
    questions: [
      {
        id: 1,
        type: QuestionTypeValue.MultipleChoice,
        question: "Welche Planeten sind Teil unseres Sonnensystems?",
        possibleAnswers: [
          {
            id: 1,
            text: "Erde",
          },
          {
            id: 2,
            text: "Saturn",
          },
          {
            id: 3,
            text: "Sonne",
          },
          {
            id: 4,
            text: "Mond",
          },
        ],
        correctAnswers: [1, 2],
      },
      {
        id: 2,
        type: QuestionTypeValue.FreeText,
        question:
          "Was ist die Telefonnummer des Universums? (Ausschließlich Zahlen eingeben)",
        possibleAnswers: [
          {
            id: 1,
            text: "5557112555",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 3,
        type: QuestionTypeValue.MultipleChoice,
        question:
          "In welcher Phase ihrer Entwicklung befindet sich unsere Sonne im Hertzsprung-Russell-Diagramm?",
        possibleAnswers: [
          {
            id: 1,
            text: "Hauptreihe",
          },
          {
            id: 2,
            text: "Roter Riese",
          },
          {
            id: 3,
            text: "Weißer Zwerg",
          },
          {
            id: 4,
            text: "Protostern",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 4,
        type: QuestionTypeValue.FreeText,
        question:
          "Welche Anfangsmasse in Sonnenmassen muss ein Stern mindestens besitzen, damit er nach einer Supernova zu einem Schwarzen Loch wird?",
        possibleAnswers: [
          {
            id: 1,
            text: "25",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 5,
        type: QuestionTypeValue.HigherLower,
        question:
          "Ist die Oberflächentemperatur eines Blauen Riesen höher oder niedriger als die eines Roten Riesen?",
        possibleAnswers: [],
        correctAnswers: [1],
      },
      {
        id: 6,
        type: QuestionTypeValue.MultipleChoice,
        question: "Wie ist der Krebsnebel entstanden?",
        possibleAnswers: [
          {
            id: 1,
            text: "Durch eine Supernova",
          },
          {
            id: 2,
            text: "Durch den Zusammenstoß zweier Galaxien",
          },
          {
            id: 3,
            text: "Durch die Entstehung eines neuen Sterns",
          },
          {
            id: 4,
            text: "Durch den Einschlag eines Kometen",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 7,
        type: QuestionTypeValue.FreeText,
        question: "In welchem Jahr betrat der erste Mensch den Mond?",
        possibleAnswers: [{ id: 1, text: "1969" }],
        correctAnswers: [1],
      },
      {
        id: 8,
        type: QuestionTypeValue.HigherLower,
        question:
          "Beträgt die Lichtgeschwindigkeit mehr oder weniger als 200.000km/s?",
        possibleAnswers: [],
        correctAnswers: [1],
      },
      {
        id: 9,
        type: QuestionTypeValue.MultipleChoice,
        question:
          "Welches internationale Projekt kombinierte Radioteleskope, um das erste Bild eines Schwarzen Lochs aufzunehmen?",
        possibleAnswers: [
          {
            id: 1,
            text: "Event Horizon Telescope",
          },
          {
            id: 2,
            text: "Square Kilometre Array",
          },
          {
            id: 3,
            text: "Very Large Array",
          },
          {
            id: 4,
            text: "James Webb Space Telescope",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 10,
        type: QuestionTypeValue.MultipleChoice,
        question:
          "Warum werden Radioteleskope oft fernab großer Städte gebaut?",
        possibleAnswers: [
          {
            id: 1,
            text: "Um Störungen durch Funk- und Radiosignale zu vermeiden",
          },
          {
            id: 2,
            text: "Um Störungen durch Mobilfunk, WLAN und andere Funksender zu reduzieren",
          },
          {
            id: 3,
            text: "Um möglichst schwache Radiosignale aus dem Weltall ungestört empfangen zu können",
          },
          {
            id: 4,
            text: "Damit die Teleskope näher an den Sternen sind",
          },
          {
            id: 5,
            text: "Weil dort die Luft kälter ist",
          },
          {
            id: 6,
            text: "Damit die Teleskope mehr Sonnenlicht erhalten",
          },
        ],
        correctAnswers: [1, 2, 3],
      },
      {
        id: 11,
        type: QuestionTypeValue.MultipleChoice,
        question:
          "Wann wurde das erste Bild eines Schwarzen Lochs veröffentlicht?",
        possibleAnswers: [
          {
            id: 1,
            text: "2019",
          },
          {
            id: 2,
            text: "1995",
          },
          {
            id: 3,
            text: "2007",
          },
          {
            id: 4,
            text: "2023",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 12,
        type: QuestionTypeValue.MultipleChoice,
        question: "Teil welches Sternbilds ist der Stern Beteigeuze?",
        possibleAnswers: [
          {
            id: 1,
            text: "Orion",
          },
          {
            id: 2,
            text: "Großer Bär",
          },
          {
            id: 3,
            text: "Cassiopeia",
          },
          {
            id: 4,
            text: "Skorpion",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 13,
        type: QuestionTypeValue.FreeText,
        question: "Wie heißt der bekannte blaue Überriese im Sternbild Orion?",
        possibleAnswers: [
          {
            id: 1,
            text: "Rigel",
          },
        ],
        correctAnswers: [1],
      },
      {
        id: 14,
        type: QuestionTypeValue.Order,
        question:
          "Ordne die Planeten unseres Sonnensystems nach ihrer Entfernung zur Sonne (nah => fern)",
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
];

export const allQuizzes: Quiz[] = rawQuizzes.map((quiz) => ({
  ...quiz,
  maxScore: calcMaxScore(quiz),
}));
