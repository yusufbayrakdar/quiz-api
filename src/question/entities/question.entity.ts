import { Document } from "mongoose";
import { InstructorSelects } from "src/instructor/entities/instructor.entity";

export class Question extends Document {
  question: object;
  choices: object;
  category: object;
  duration: object;
  grade: object;
  creator: string;
}

export const QuestionSelects = {
  basic: "question choices category duration grade creator",
};

export const QuestionPopulate = {
  path: "instructor",
  select: InstructorSelects.public,
};
