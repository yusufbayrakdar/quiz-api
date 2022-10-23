import { Document } from "mongoose";

export class QuizStudent extends Document {
  student: string;
  instructor: string;
  quiz: string;
  isActive: boolean;
}
