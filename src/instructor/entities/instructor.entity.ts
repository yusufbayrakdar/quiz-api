import { Document } from "mongoose";

export class Instructor extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  confirmed: boolean;
  password: string;
}

export const InstructorSelects = {
  basic: "firstName lastName phone confirmed",
  withPassword: "firstName lastName phone confirmed password",
  public: "firstName lastName phone confirmed -_id",
};
