import * as mongoose from "mongoose";

export const QuestionSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
    question: [
      {
        shape: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shape",
          required: true,
        },
        _id: false,
        coordinate: String,
      },
    ],
    choices: [
      {
        shape: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shape",
        },
        _id: false,
        coordinate: String,
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    duration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Duration",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
    },
    videoUrl: String,
    description: String,
  },
  { timestamps: true }
);
