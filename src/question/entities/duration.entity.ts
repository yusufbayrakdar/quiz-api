import { Document } from "mongoose";

export class Duration extends Document {
  duration: number;
  isActive: boolean;
}
