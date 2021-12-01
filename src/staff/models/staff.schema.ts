import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

export const StaffSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
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

    password: { type: String, set: toHashPassword, select: false },

    lastLoginDate: Date,
  },
  { timestamps: true }
);

function toHashPassword(password) {
  if (password) {
    return bcrypt.hashSync(password, 10);
  }
}
