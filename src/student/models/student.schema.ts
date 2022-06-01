import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";
import * as generator from "generate-password";
import { capitalizeFirstLetter } from "src/utilities/helpers";

let passwordInit;
function generatePasswordInit() {
  passwordInit = generator.generate({
    length: 4,
    numbers: true,
    uppercase: true,
  });
  return passwordInit;
}

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
    nickname: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    passwordInit: {
      type: String,
      set: generatePasswordInit,
      default: passwordInit,
      immutable: true,
    },
    password: {
      type: String,
      set: toHashPassword,
      select: false,
      default: toHashPassword(passwordInit),
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
  },
  { timestamps: true }
);

function toHashPassword(password) {
  if (password) {
    return bcrypt.hashSync(password, 10);
  }
}
