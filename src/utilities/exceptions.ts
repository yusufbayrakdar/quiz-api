import { HttpException, HttpStatus } from "@nestjs/common";

export class ExceptionForbidden extends HttpException {
  constructor(message = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ExceptionUnauthorized extends HttpException {
  constructor(message = "Invalid credentials") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ExceptionBadRequest extends HttpException {
  constructor(message = "Bad Request") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ExceptionAlreadyExist extends HttpException {
  constructor(message = "Already exists") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ExceptionNotFound extends HttpException {
  constructor() {
    super("Data not found", HttpStatus.NOT_FOUND);
  }
}
