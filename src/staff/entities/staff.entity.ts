import { Document } from "mongoose";

export class Staff extends Document {
  isActive: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  lastLoginDate: Date;
}

export const StaffSelects = {
  basic: "email password firstName lastName lastLoginDate",
};
