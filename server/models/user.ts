import mongoose, { Schema, Document, Model } from "mongoose";
import validator from "validator";

const user = new mongoose.Schema({
  googleId: {
    required: false,
    type: String,
  },
  facebookId: {
    required: false,
    type: String,
  },
  githubId: {
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
});

export default mongoose.model("User", user);
