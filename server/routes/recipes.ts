import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Recipe from "../models/recipe";
import { validationResult } from "express-validator";
import * as recipeValidators from "../validators/recipes";
import { checkValidationErrors } from "../utils/functions";
import { User as IUser } from "../utils/types";

const router = express.Router();

router.get("/all", (req, res) => {});

router.get("/entrees", (req, res) => {});

router.get("/mains", (req, res) => {});

router.get("/deserts", (req, res) => {});

router.post(
  "/add",
  recipeValidators.addRecipeValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    checkValidationErrors(errors);
    (async () => {
      try {
        const user = req.user as IUser;
        console.log(user.id);
        // res.send("success");
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
