import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { verify } from "jsonwebtoken";

import { UserService } from "src/user/user.service";
import { ExceptionForbidden } from "../exceptions";
import { UNAUTHORIZED_REQUEST } from "../errors";
import ROLES from "../roles";

@Injectable()
export class InstructorGuard extends AuthGuard("jwt") {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super();
  }

  // isLoggedIn
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers?.token;

    if (token) {
      try {
        return verify(
          token,
          process.env.USER_SECRET_KEY,
          async (error, user) => {
            const { confirmed }: any = await this.userService.findById(
              user._id,
              "confirmed"
            );
            const isAdmin = user.role === ROLES.ADMIN;
            const isConfirmedInstructor =
              user.role === ROLES.INSTRUCTOR && confirmed;

            if (error || (!isAdmin && !isConfirmedInstructor)) {
              throw new ExceptionForbidden(UNAUTHORIZED_REQUEST);
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
