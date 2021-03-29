import mongoose, { Schema } from "mongoose";
import { IMongoDBUser } from "../src/types";

const user: Schema = new mongoose.Schema({
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
});

export default mongoose.model<IMongoDBUser>("User", user);
