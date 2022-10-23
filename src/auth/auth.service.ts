import { Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";

@Injectable()
export class AuthService {
  generateUserToken(user: object) {
    return sign(user, process.env.USER_SECRET_KEY, {
      expiresIn: "360 days",
    });
  }
}
