import * as mongoose from "mongoose";

export const QuizStudentSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
