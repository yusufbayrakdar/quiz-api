import { Document } from "mongoose";

export class StudentInstructor extends Document {
  student: string;
  instructor: string;
  isActive: boolean;
}
