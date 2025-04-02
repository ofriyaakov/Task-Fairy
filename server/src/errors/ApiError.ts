import { StatusCodes } from "http-status-codes";

export abstract class ApiError extends Error {
  httpStatusCode: StatusCodes;
  apiError: {
    errorMessage: string;
    extraDetails: string;
  };

  constructor(
    httpStatusCode: StatusCodes,
    errorMessage: string,
    extraDetails: string
  ) {
    super(`${errorMessage} - ${extraDetails}`);

    this.httpStatusCode = httpStatusCode;
    this.apiError = { errorMessage, extraDetails };

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
