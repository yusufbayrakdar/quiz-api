import { Document } from "mongoose";
export class Quiz extends Document {
  name: string;
  duration: number;
  questionList: string[];
  creator: string;
}

export const QuizSelects = {
  basic: "name questionList duration creator",
};
