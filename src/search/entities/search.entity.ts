import { Document } from "mongoose";

export class Search extends Document {
  isActive: boolean;
  question: object;
  choices: object;
  correctAnswer: string;
  category: string;
  duration: number;
  grade: string;
  creatorName: string;
  creatorId: string;
  videoUrl: string;
  description: string;
}

export const SearchSelects = {
  basic: "question choices category duration grade creatorId creatorName",
};
