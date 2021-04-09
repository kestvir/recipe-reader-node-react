import mongoose, { Schema } from "mongoose";
import { Recipe } from "../shared/types";

export const recipe: Schema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    img: {
      file: { required: true, type: String },
      name: { required: true, type: String },
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
