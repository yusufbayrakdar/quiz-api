import * as mongoose from "mongoose";

export const SearchSchema = new mongoose.Schema(
  {
    id: { auto: true, type: Number },
    questionNumber: Number,
    isActive: Boolean,
    creatorName: String,
    creatorId: mongoose.Schema.Types.ObjectId,
    question: Object,
    choices: Object,
    correctAnswer: String,
    duration: Number,
    category: String,
    grade: String,
    videoUrl: String,
    description: String,
  },
  { timestamps: true, strict: true }
);
