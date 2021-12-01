import { Document } from "mongoose";

export class Student extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export const StudentSelects = {
  basic: "firstName lastName phone",
  withPassword: "firstName lastName phone password",
  public: "firstName lastName phone -_id",
};
