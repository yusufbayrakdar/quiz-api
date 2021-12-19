import { Document } from "mongoose";

export class Student extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  nickname: string;
  password: string;
  passwordInit: string;
}

export const StudentSelects = {
  basic: "firstName lastName phone nickname",
  withPassword: "firstName lastName phone nickname password",
};
