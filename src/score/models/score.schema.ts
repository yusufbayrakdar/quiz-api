import * as mongoose from "mongoose";

export const ScoreSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    score: Number,
    totalQuestions: Number,
    finishedAt: Number,
  },
  { timestamps: true }
);
