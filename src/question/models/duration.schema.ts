import * as mongoose from "mongoose";

export const DurationSchema = new mongoose.Schema(
  {
    duration: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
