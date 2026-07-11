// export const quiz: Quiz[] = [
//   {
//     id: 1,
//     title: "Astronomie SoSe 26",
//     description: "Ein Quiz zu den Inhalten des Kurses im Sommer Semester 26",
//     cover: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
//     questions: [
//       {
//         type: "single",

//       }
//     ]
//   }
// ]

type Quiz = {
  id: number;
  title: string;
  description: string;
  cover: string;
  questions: Question[];
};

type Question = {
  type: QuestionType;
  question: string;
  choices?: string[];
};

type QuestionType = "single" | "multiple" | "order" | "text";
