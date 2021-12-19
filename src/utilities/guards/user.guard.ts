import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { verify } from "jsonwebtoken";
import { ExceptionForbidden } from "../exceptions";

@Injectable()
export class UserGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }

  // isLoggedIn
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers?.token;

    if (token) {
      try {
        return verify(token, process.env.STUDENT_SECRET_KEY, (error, user) => {
          if (error) {
            return verify(
              token,
              process.env.INSTRUCTOR_SECRET_KEY,
              (error, user) => {
                if (error) {
                  throw new ExceptionForbidden();
                } else {
                  return Object.assign(req, { user });
                }
              }
            );
          } else {
            return Object.assign(req, { user });
          }
        });
      } catch (error) {
        throw new ExceptionForbidden();
      }
    }
    return false;
  }
}
