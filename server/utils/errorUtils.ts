import { Result, ValidationError } from "express-validator";
import { CustomError } from "../shared/types";

export const checkValidationErrors = (errors: Result<ValidationError>) => {
  if (!errors.isEmpty()) {
    const error: CustomError = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
};
