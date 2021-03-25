import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not authorized error");
  }

  serializeErrors() {
    return [{ message: "Unauthorized" }];
  }
}
