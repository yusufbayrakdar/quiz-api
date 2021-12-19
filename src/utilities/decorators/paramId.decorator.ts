import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { ExceptionBadRequest } from "../exceptions";

export const IdParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!isValidObjectId(req.params._id)) {
      throw new ExceptionBadRequest("Invalid _id");
    }
    return req.params._id;
  }
);
