import { Document } from "mongoose";
import { InstructorSelects } from "src/instructor/entities/instructor.entity";

export class Quiz extends Document {
  questionList: string[];
  assignedStudents: string[];
  duration: number;
  creator: string;
}

export const QuizSelects = {
  basic: "questionList assignedStudents duration creator",
  public: "questionList assignedStudents duration creator -_id",
};

export const QuizPopulate = {
  path: "instructor",
  select: InstructorSelects.public,
};
