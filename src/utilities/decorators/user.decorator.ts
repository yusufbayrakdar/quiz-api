import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

import { ExceptionBadRequest } from "../exceptions";

export const User = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (key === "_id") {
      if (!isValidObjectId(req.params._id)) {
        throw new ExceptionBadRequest("Invalid _id");
      }
    }
    return req?.user[key] || req.user;
  }
);
