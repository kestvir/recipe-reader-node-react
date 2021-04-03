import mongoose, { Schema } from "mongoose";
import { Recipe } from "../utils/types";

export const recipe: Schema = new mongoose.Schema(
  {
    title: {
      required: true,
      unique: true,
      type: String,
    },
    img: {
      required: true,
      type: String,
    },
    category: {
      required: true,
      type: String,
    },
    ingredients: {
      required: true,
      type: String,
    },
    instructions: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Recipe>("Recipe", recipe);
