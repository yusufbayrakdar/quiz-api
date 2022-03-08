import * as mongoose from "mongoose";

export const SearchSchema = new mongoose.Schema(
  {
    isActive: Boolean,
    creator: Object,
    question: Object,
    choices: Object,
    correctAnswer: String,
    duration: Number,
    category: String,
    grade: String,
    videoUrl: String,
    description: String,
  },
  { timestamps: true }
);
