import * as mongoose from "mongoose";

export const ShapeSchema = new mongoose.Schema(
  {
    searchTag: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 999,
    },
  },
  { timestamps: true }
);
