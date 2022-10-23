import * as mongoose from "mongoose";

export const QuizSchema = new mongoose.Schema(
  {
    name: String,
    duration: Number,
    questionList: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Question",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
