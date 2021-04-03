import { ValidationError } from "express-validator";
import { Document } from "mongoose";

export interface MongoDBUser extends Document {
  googleId?: string;
  facebookId?: string;
  email: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  __v: number;
  _id: string;
}

export interface User {
  googleId?: string;
  facebookId?: string;
  email: string;
  id: string;
}

export interface CustomError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

export type DishCategory = "entree" | "main" | "desert";

export interface Recipe extends Document {
  title: string;
  img: string;
  category: DishCategory;
  ingredients: string;
  instructions: string;
}
