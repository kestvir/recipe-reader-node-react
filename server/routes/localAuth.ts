import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { ICustomError } from "../utils/types";
import { validationResult, Result, ValidationError } from "express-validator";
import { signupValidator } from "../validators/auth";
const router = express.Router();

// const checkValidationErrors = (errors: Result<ValidationError>) => {

// };

router.post(
  "/signup",
  signupValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req?.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error: ICustomError = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    (async () => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          password: hashedPassword,
        });
        await newUser.save();
        req.login(newUser, (err) => {
          if (err) {
            return next(err);
          } else {
            res.send("success");
          }
        });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    })();
  }
);

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("success");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send("success");
});

export default router;
