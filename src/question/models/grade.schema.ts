import * as mongoose from "mongoose";

export const GradeSchema = new mongoose.Schema(
  {
    grade: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
