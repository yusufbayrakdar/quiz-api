import * as mongoose from "mongoose";

export const SearchSchema = new mongoose.Schema(
  {
    isActive: Boolean,
    creator: String,
    question: Object,
    choices: Object,
    correctAnswer: String,
    duration: Number,
    category: String,
    grade: String,
  },
  { timestamps: true }
);
