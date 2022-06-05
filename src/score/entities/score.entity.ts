import { Document } from "mongoose";
import { QuizSelects } from "src/quiz/entities/quiz.entity";
import { StudentSelects } from "src/student/entities/student.entity";

export class Score extends Document {
  student: string;
  quiz: string;
  score: number;
  totalQuestions: number;
  finishedAt: number;
}

export const ScoreSelects = {
  basic: "student quiz score totalQuestions finishedAt",
};

export const ScorePopulates = [
  {
    path: "student",
    select: StudentSelects.basic,
  },
  {
    path: "quiz",
    select: QuizSelects.basic,
  },
];
