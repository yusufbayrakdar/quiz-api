import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

export const StaffSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
    nickname: String,

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
