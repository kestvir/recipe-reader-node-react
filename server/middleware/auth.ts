import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/types";

export const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  const error: CustomError = new Error("Unauthorized.");
  error.statusCode = 401;
  throw error;
};
