import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";
import * as generator from "generate-password";
import { capitalizeFirstLetter } from "src/utilities/helpers";

const passwordInit = generator.generate({
  length: 4,
  numbers: true,
  uppercase: true,
});

export const StudentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
      set: capitalizeFirstLetter,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
      set: capitalizeFirstLetter,
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordInit: {
      type: String,
      default: passwordInit,
      immutable: true,
    },
    password: {
      type: String,
      set: toHashPassword,
      select: false,
      default: toHashPassword(passwordInit),
    },
  },
  { timestamps: true }
);

function toHashPassword(password) {
  if (password) {
    return bcrypt.hashSync(password, 10);
  }
}
