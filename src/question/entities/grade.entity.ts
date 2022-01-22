import { Document } from "mongoose";

export class Grade extends Document {
  grade: string;
  isActive: boolean;
}
