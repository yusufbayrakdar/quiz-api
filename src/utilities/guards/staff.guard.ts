import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { verify } from "jsonwebtoken";
import { ExceptionForbidden } from "../exceptions";

@Injectable()
export class StaffGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }

  // isLoggedIn
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const tokenstaff = req.headers?.tokenstaff;

    if (tokenstaff) {
      try {
        return verify(
          tokenstaff,
          process.env.SECRET_KEY_STAFF,
          (error, user) => {
            if (error) {
              throw new ExceptionForbidden();
            } else {
              return Object.assign(req, { user });
            }
          }
        );
      } catch (error) {
        throw new ExceptionForbidden();
      }
    }
    return false;
  }
}
