import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { verify } from "jsonwebtoken";
import { UNAUTHORIZED_REQUEST } from "../errors";
import { ExceptionForbidden } from "../exceptions";
import ROLES from "../roles";

@Injectable()
export class StudentGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }

  // isLoggedIn
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers?.token;

    if (token) {
      try {
        return verify(token, process.env.USER_SECRET_KEY, (error, user) => {
          if (error || user.role !== ROLES.STUDENT) {
            throw new ExceptionForbidden(UNAUTHORIZED_REQUEST);
          } else {
            return Object.assign(req, { user });
          }
        });
      } catch (error) {
        throw new ExceptionForbidden(UNAUTHORIZED_REQUEST);
      }
    }
    return false;
  }
}
