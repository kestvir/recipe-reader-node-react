import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Recipe, { recipe } from "../models/recipe";
import { validationResult } from "express-validator";
import * as recipeValidators from "../validators/recipes";
import { checkValidationErrors } from "../utils/functions";
import { User as IUser, CustomError } from "../utils/types";

const router = express.Router();

router.get("/all", (req, res) => {});

// router.get("/entrees", (req, res) => {});

// router.get("/mains", (req, res) => {});

// router.get("/deserts", (req, res) => {});

router.post(
  "/add",
  recipeValidators.addRecipeValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    checkValidationErrors(errors);
    const recipeObj = { ...req.body };
    (async () => {
      try {
        const reqUser = req.user as IUser;
        const user = await User.findById(reqUser.id);

        if (user) {
          user.recipes.push(recipeObj);
          await user.save();
        } else {
          const error: CustomError = new Error(
            "Password reset token in invalid or has been expired."
          );
          error.statusCode = 401;
          throw error;
        }
        res.send("success");
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    })();
  }
);

export default router;
