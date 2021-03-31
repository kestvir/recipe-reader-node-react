import mongoose, { Schema } from "mongoose";
import { IRecipe } from "../src/types";

export const recipe: Schema = new mongoose.Schema(
  {
    title: {
      required: true,
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
      type: [String],
    },
    instructions: {
      required: true,
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRecipe>("Recipe", recipe);
