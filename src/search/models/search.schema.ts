import * as mongoose from "mongoose";

export const SearchSchema = new mongoose.Schema(
  {
    id: { auto: true, type: Number },
    questionNumber: Number,
    isActive: Boolean,
    creatorName: String,
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
    question: Object,
    choices: Object,
    correctAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shape",
      required: true,
    },
    duration: Number,
    category: String,
    grade: String,
    videoUrl: String,
    description: String,
  },
  { timestamps: true, strict: true }
);
