import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";
import * as generator from "generate-password";
import { capitalizeFirstLetter } from "src/utilities/helpers";
import ROLES from "src/utilities/roles";

let passwordInit;
function generatePasswordInit() {
  passwordInit = generator.generate({
    length: 4,
    numbers: true,
    lowercase: false,
  });
  return passwordInit;
}

export const UserSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: ROLES.STUDENT,
      immutable: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
      set: capitalizeFirstLetter,
      minlength: 4,
      maxlength: 32,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    nickname: {
      type: String,
      trim: true,
      unique: true,
      minlength: 4,
      maxlength: 32,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    passwordInit: {
      type: String,
      set: generatePasswordInit,
      default: passwordInit,
      immutable: true,
      select: false,
    },
    password: {
      type: String,
      set: toHashPassword,
      select: false,
      default: toHashPassword(passwordInit),
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastLoginDate: Date,
  },
  { timestamps: true }
);

function toHashPassword(password) {
  if (password) {
    return bcrypt.hashSync(password, 10);
  }
}
