import mongoose, { Schema } from "mongoose";
import { MongoDBUser } from "../utils/types";

const user: Schema = new Schema({
  googleId: {
    required: false,
    type: String,
  },
  facebookId: {
    required: false,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: false,
    type: String,
  },
  resetPasswordToken: {
    required: false,
    type: String,
  },
  resetPasswordExpires: {
    required: false,
    type: Date,
  },
  recipes: [
    {
      required: false,
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
});

export default mongoose.model<MongoDBUser>("User", user);
