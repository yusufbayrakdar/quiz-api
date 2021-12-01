import { Document } from "mongoose";
import { InstructorSelects } from "src/instructor/entities/instructor.entity";

export class Quiz extends Document {
  questions: string[];
  duration: number;
  creator: string;
}

export const QuizSelects = {
  basic: "questions duration creator",
  public: "questions duration creator -_id",
};

export const QuizPopulate = {
  path: "instructor",
  select: InstructorSelects.public,
};
