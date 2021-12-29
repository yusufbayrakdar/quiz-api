import { Document } from "mongoose";
import { InstructorSelects } from "src/instructor/entities/instructor.entity";

export class Question extends Document {
  questions: string[];
  duration: number;
  creator: string;
}

export const QuestionSelects = {
  basic: "questions duration creator",
  public: "questions duration creator -_id",
};

export const QuestionPopulate = {
  path: "instructor",
  select: InstructorSelects.public,
};
