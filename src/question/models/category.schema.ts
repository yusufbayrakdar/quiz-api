import * as mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema(
  {
    category: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
