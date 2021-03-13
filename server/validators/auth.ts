import { body } from "express-validator";
import User from "../models/user";

export const signupValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email address already exists!");
        }
      });
    })
    .normalizeEmail({ gmail_remove_dots: false }),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must consist of atleast 6 characters."),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
];

export const forgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail({ gmail_remove_dots: false }),
];

export const resetPasswordValidator = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must consist of atleast 6 characters."),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
];
