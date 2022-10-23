import { Document } from "mongoose";

export class User extends Document {
  isActive: boolean;
  role: string;
  fullName: string;
  phone: string;
  nickname: string;
  confirmed: boolean;
  passwordInit: string;
  password: string;
  creator: string;
  lastLoginDate: Date;
  assigned: boolean;
}

export const UserSelects = {
  STUDENT: {
    basic: "isActive role fullName phone nickname lastLoginDate creator",
    withPassword:
      "isActive role fullName phone nickname password passwordInit lastLoginDate creator",
  },
  INSTRUCTOR: {
    basic: "isActive role fullName phone confirmed lastLoginDate",
    withPassword:
      "isActive role fullName phone confirmed password lastLoginDate",
  },
  ADMIN: {
    basic: "isActive role fullName phone confirmed lastLoginDate",
    withPassword:
      "isActive role fullName phone confirmed password lastLoginDate",
  },
};
