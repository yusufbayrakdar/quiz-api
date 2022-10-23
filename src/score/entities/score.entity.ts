import { Document } from "mongoose";
import { QuizSelects } from "src/quiz/entities/quiz.entity";
import { UserSelects } from "src/user/entities/user.entity";

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
    select: UserSelects.STUDENT.basic,
  },
  {
    path: "quiz",
    select: QuizSelects.basic,
  },
];
