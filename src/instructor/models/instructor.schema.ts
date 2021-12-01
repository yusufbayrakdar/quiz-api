import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

export const InstructorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },

    password: { type: String, set: toHashPassword, select: false },
  },
  { timestamps: true }
);

function toHashPassword(password) {
  if (password) {
    return bcrypt.hashSync(password, 10);
  }
}
