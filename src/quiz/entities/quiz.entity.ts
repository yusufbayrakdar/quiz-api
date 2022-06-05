import { Document } from "mongoose";
import { InstructorSelects } from "src/instructor/entities/instructor.entity";

export class Quiz extends Document {
  name: string;
  duration: number;
  questionList: string[];
  assignedStudents: string[];
  creator: string;
}

export const QuizSelects = {
  basic: "name questionList assignedStudents duration creator",
};
