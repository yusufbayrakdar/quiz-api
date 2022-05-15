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
    assignedStudents: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Student",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
  },
  { timestamps: true }
);
