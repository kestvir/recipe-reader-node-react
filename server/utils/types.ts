import { ValidationError } from "express-validator";
import { Document } from "mongoose";

export interface IMongoDBUser extends Document {
  googleId?: string;
  facebookId?: string;
  email: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  __v: number;
  _id: string;
}

export interface IUserToSend {
  googleId?: string;
  facebookId?: string;
  email: string;
  id: string;
}

export interface ICustomError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}
