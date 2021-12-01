import * as mongoose from "mongoose";

export const QuizSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    duration: Number,
  },
  { timestamps: true }
);
