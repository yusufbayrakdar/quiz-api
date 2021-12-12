import { Document } from "mongoose";

export class Staff extends Document {
  isActive: boolean;
  nickname: string;
  password: string;
  lastLoginDate: Date;
}

export const StaffSelects = {
  basic: "nickname password lastLoginDate",
};
