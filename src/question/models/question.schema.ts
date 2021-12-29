import * as mongoose from "mongoose";

export const QuestionSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
    // QuestionMap: {   TODO: implement shape coordinates
    //   QuestionCoordinate
    // },
    duration: Number,
  },
  { timestamps: true }
);
