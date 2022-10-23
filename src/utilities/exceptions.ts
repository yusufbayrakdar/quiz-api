import { HttpException, HttpStatus } from "@nestjs/common";
import {
  ALREADY_EXIST,
  BAD_REQUEST,
  FAILED_LOGIN,
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from "./errors";

export class ExceptionForbidden extends HttpException {
  constructor(message = UNAUTHORIZED_REQUEST) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ExceptionUnauthorized extends HttpException {
  constructor(message = FAILED_LOGIN) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ExceptionBadRequest extends HttpException {
  constructor(message = BAD_REQUEST) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ExceptionAlreadyExist extends HttpException {
  constructor(message = ALREADY_EXIST) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ExceptionNotFound extends HttpException {
  constructor(message = NOT_FOUND) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
