import { Document } from "mongoose";

export class Search extends Document {
  isActive: boolean;
  question: object;
  choices: object;
  correctAnswer: string;
  category: string;
  duration: number;
  grade: string;
  creator: object;
  videoUrl: string;
  description: string;
}

export const SearchSelects = {
  basic: "question choices category duration grade creator",
};
