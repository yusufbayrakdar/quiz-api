import { Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";

@Injectable()
export class AuthService {
  generateInstructorToken(userId: string, phone: string) {
    return sign({ _id: userId, phone }, process.env.INSTRUCTOR_SECRET_KEY, {
      expiresIn: "360 days",
    });
  }

  generateStudentToken(userId: string, phone: string) {
    return sign({ _id: userId, phone }, process.env.INSTRUCTOR_SECRET_KEY, {
      expiresIn: "360 days",
    });
  }

  generateTokenStaff(userId: string, phone: string) {
    return sign({ _id: userId, phone }, process.env.SECRET_KEY_STAFF, {
      expiresIn: "360 days",
    });
  }
}
